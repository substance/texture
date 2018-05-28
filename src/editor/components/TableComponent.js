import {
  CustomSurface, platform,
  DefaultDOMElement as DOM, domHelpers, getRelativeBoundingRect,
  keys
} from 'substance'
import TableEditing from '../../article/TableEditing'
import {
  getCellRange, computeUpdatedSelection
} from '../../article/tableHelpers'
import TableClipboard from '../util/TableClipboard'
import TableCellComponent from './TableCellComponent'
import TableContextMenu from './TableContextMenu'

export default class TableComponent extends CustomSurface {

  constructor(...args) {
    super(...args)

    this._selectionData = {}
    this._tableEditing = new TableEditing(this.context.editorSession, this.props.node.id, this.getId())
    this._clipboard = new TableClipboard(this._tableEditing)
  }

  getChildContext() {
    return {
      surface: this,
      parentSurfaceId: this.getId(),
      // HACK: nulling this so that nested surfaces get an id that are relative to
      // this surface instead of the isolatedNodeComponent
      isolatedNodeComponent: null
    }
  }

  shouldRerender() {
    return false
  }

  didMount() {
    super.didMount()

    this._tableSha = this.props.node._getSha()

    this.context.editorSession.onRender('document', this._onDocumentChange, this)
    this.context.editorSession.onRender('selection', this._onSelectionChange, this)

    this._positionSelection(this._getSelectionData())
  }

  dispose() {
    super.dispose()

    this.context.editorSession.off(this)
  }

  render($$) {
    let el = $$('div').addClass('sc-table')
    el.on('mousedown', this._onMousedown)
      .on('mouseup', this._onMouseup)
    el.append(this._renderTable($$))
    el.append(this._renderKeyTrap($$))
    el.append(this._renderUnclickableOverlays($$))
    // el.append(this._renderClickableOverlays($$))
    el.append(this._renderContextMenu($$))
    return el
  }

  _renderTable($$) {
    let table = $$('table').ref('table')
    let node = this.props.node
    let matrix = node.getCellMatrix()
    for (let i = 0; i < matrix.length; i++) {
      let cells = matrix[i]
      let tr = $$('tr')
      for (let j = 0; j < cells.length; j++) {
        if (cells[j].shadowed) continue
        let cell = cells[j]
        tr.append(
          $$(TableCellComponent, { node: cell, disabled: true })
            .ref(cell.id)
            .on('enter', this._onCellEnter)
            .on('tab', this._onCellTab)
            .on('escape', this._onCellEscape)
        )
      }
      table.append(tr)
    }
    table.on('mousemove', this._onMousemove)
      .on('dblclick', this._onDblclick)
      .on('contextmenu', this._onContextMenu)
      .on('contextmenuitemclick', this._onContextmenuitemclick)
    return table
  }

  _renderKeyTrap($$) {
    return $$('textarea').addClass('se-keytrap').ref('keytrap')
      .css({ position: 'absolute', width: 0, height: 0, opacity: 0 })
      .on('keydown', this._onKeydown)
      .on('input', this._onInput)
      .on('copy', this._onCopy)
      .on('paste', this._onPaste)
      .on('cut', this._onCut)
  }

  _renderUnclickableOverlays($$) {
    let el = $$('div').addClass('se-unclickable-overlays')
    el.append(
      this._renderSelectionOverlay($$)
    )
    el.append(
      this.props.unclickableOverlays
    )
    return el
  }

  _renderSelectionOverlay($$) {
    let el = $$('div').addClass('se-selection-overlay')
    el.append(
      $$('div').addClass('se-selection-anchor').ref('selAnchor').css('visibility', 'hidden'),
      $$('div').addClass('se-selection-range').ref('selRange').css('visibility', 'hidden')
    )
    return el
  }

  _renderContextMenu($$) {
    const configurator = this.context.configurator
    // HACK: Skip if toolpanel not defined (this happens when used from the reader)
    const toolPanel = configurator.getToolPanel('table-context-menu')
    if (!toolPanel) return

    let contextMenu = $$(TableContextMenu, {
      toolPanel: configurator.getToolPanel('table-context-menu')
    }).ref('contextMenu')
      .addClass('se-context-menu')
      .css({ display: 'none' })
    return contextMenu
  }

  _onDocumentChange() {
    const table = this.props.node
    // Note: using a simplified way to detect when a table
    // has changed structurally
    // TableElementNode is detecting such changes and
    // updates an internal 'sha' that we can compare against
    if (table._hasShaChanged(this._tableSha)) {
      this.rerender()
      this._tableSha = table._getSha()
    }
  }

  _onSelectionChange(sel) {
    const self = this
    if (!sel || sel.isNull()) {
      _disableActiveCell()
      this._hideSelection()
    } else if (sel.isPropertySelection()) {
      let nodeId = sel.path[0]
      if (this._activeCell !== nodeId) {
        _disableActiveCell()
        let newCellEditor = this.refs[nodeId]
        if (newCellEditor) {
          // console.log('ENABLING CELL EDITOR', nodeId)
          newCellEditor.extendProps({ disabled: false })
          this._activeCell = nodeId
        }
      }
      if (this._activeCell) {
        // TODO: this could be simplified
        let doc = this.context.editorSession.getDocument()
        let cell = doc.get(this._activeCell)
        this._positionSelection({
          type: 'range',
          anchorCellId: cell.id,
          focusCellId: cell.id,
        }, true)
      } else {
        this._hideSelection()
      }
    } else if (sel.surfaceId !== this.getId()) {
      _disableActiveCell()
      this._hideSelection()
    } else {
      _disableActiveCell()
    }
    this._hideContextMenu()

    function _disableActiveCell() {
      const activeCellId = self._activeCell
      if(activeCellId) {
        let cellEditor = self.refs[activeCellId]
        if (cellEditor) {
          // console.log('DISABLING CELL EDITOR', activeCellId)
          cellEditor.extendProps({ disabled: true })
        }
        self._activeCell = null
      }
    }

  }

  _onMousedown(e) {
    e.stopPropagation()
    // TODO: do not update the selection if right-clicked and already having a selection
    if (platform.inBrowser) {
      DOM.wrap(window.document).on('mouseup', this._onMouseup, this, {
        once: true
      })
    }
    // console.log('_onMousedown', e)
    let selData = this._selectionData
    if (!selData) selData = this._selectionData = {}
    let target = this._getClickTargetForEvent(e)
    // console.log('target', target)
    if (!target) return

    let isRightButton = domHelpers.isRightButton(e)
    if (isRightButton) {
      // console.log('IS RIGHT BUTTON')
      // this will be handled by onContextMenu
      if (target.type === 'cell') {
        let targetCell = this.props.node.get(target.id)
        let _needSetSelection = true
        let _selData = this._getSelectionData()
        if (_selData && targetCell) {
          let { startRow, startCol, endRow, endCol } = getCellRange(this.props.node, _selData.anchorCellId, _selData.focusCellId)
          _needSetSelection = (
            targetCell.colIdx < startCol || targetCell.colIdx > endCol ||
            targetCell.rowIdx < startRow || targetCell.rowIdx > endRow
          )
        }
        if (_needSetSelection) {
          this._isSelecting = true
          selData.anchorCellId = target.id
          selData.focusCellId = target.id
          this._requestSelectionChange(this._tableEditing.createTableSelection(selData))
        }
      }
      return
    }
    if (target.type === 'cell') {
      this._isSelecting = true
      selData.focusCellId = target.id
      if (!e.shiftKey) {
        selData.anchorCellId = target.id
      }
      e.preventDefault()
      this._requestSelectionChange(this._tableEditing.createTableSelection(selData))
    }
  }

  _onMouseup(e) {
    e.stopPropagation()
    if (this._isSelecting) {
      e.preventDefault()
      this._isSelecting = false
    }
  }

  _onMousemove(e) {
    if (this._isSelecting) {
      const selData = this._selectionData
      let cellId = this._mapClientXYToCellId(e.clientX, e.clientY)
      if (cellId !== selData.focusCellId) {
        selData.focusCellId = cellId
        this._requestSelectionChange(this._tableEditing.createTableSelection(selData))
      }
    }
  }

  _onDblclick(e) {
    e.preventDefault()
    e.stopPropagation()
    this._requestEditCell()
  }

  _onKeydown(e) {
    let handled = false
    switch (e.keyCode) {
      case keys.LEFT:
        this._nav(0, -1, e.shiftKey)
        handled = true
        break
      case keys.RIGHT:
        this._nav(0, 1, e.shiftKey)
        handled = true
        break
      case keys.UP:
        this._nav(-1, 0, e.shiftKey)
        handled = true
        break
      case keys.DOWN:
        this._nav(1, 0, e.shiftKey)
        handled = true
        break
      case keys.ENTER: {
        this._requestEditCell()
        handled = true
        break
      }
      case keys.TAB: {
        this._nav(0, 1)
        handled = true
        break
      }
      case keys.DELETE:
      case keys.BACKSPACE: {
        this._clearSelection()
        handled = true
        break
      }
      default:
        //
    }
    // let an optional keyboard manager handle the key
    if (!handled) {
      const keyboardManager = this.context.keyboardManager
      if (keyboardManager) {
        handled = keyboardManager.onKeydown(e)
      }
    }
    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  /*
    Type into cell (replacing the existing content)
  */
  _onInput() {
    const value = this.refs.keytrap.val()
    this._requestEditCell(value)
    // Clear keytrap after sending an action
    this.refs.keytrap.val('')
  }

  _onCellEnter(e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    if (e.detail.shiftKey) {
      this._tableEditing.insertSoftBreak()
    } else {
      this._nav(1, 0, false, { anchorCellId: cellEl.id, focusCellId: cellEl.id })
    }
  }

  _onCellTab(e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    this._nav(0, 1, false, { anchorCellId: cellEl.id, focusCellId: cellEl.id })
  }

  _onCellEscape(e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    this._requestSelectionChange(this._tableEditing.createTableSelection({ anchorCellId: cellEl.id, focusCellId: cellEl.id }))
  }

  _onCopy(e) {
    this._clipboard.onCopy(e)
  }

  _onPaste(e) {
    this._clipboard.onPaste(e)
  }

  _onCut(e) {
    this._clipboard.onCut(e)
  }

  _onContextMenu(e) {
    e.preventDefault()
    e.stopPropagation()
    this._showContextMenu(e)
  }

  _onContextmenuitemclick(e) {
    e.preventDefault()
    e.stopPropagation()
    this._hideContextMenu()
  }

  _getSelection() {
    return this.context.editorSession.getSelection()
  }

  _getSelectionData() {
    let sel = this._getSelection()
    if (sel && sel.surfaceId === this.getId()) {
      return sel.data
    }
  }

  _requestEditCell(initialValue) {
    let selData = this._getSelectionData()
    if (selData) {
      this._tableEditing.editCell(selData.anchorCellId, initialValue)
    }
  }

  _requestSelectionChange(newSel) {
    // console.log('requesting selection change', newSel)
    if (newSel) newSel.surfaceId = this.getId()
    this.context.editorSession.setSelection(newSel)
  }

  _getClickTargetForEvent(e) {
    let target = DOM.wrap(e.target)
    let cellEl = domHelpers.findParent(target, 'td,th')
    if (cellEl) {
      return { type: 'cell', id: cellEl.id }
    }
  }

  _getRowCol(cellEl) {
    let rowIdx = parseInt(cellEl.getAttribute('data-row-idx'), 10)
    let colIdx = parseInt(cellEl.getAttribute('data-col-idx'), 10)
    return [rowIdx, colIdx]
  }

  _mapClientXYToCellId(x, y) {
    // TODO: this could be optimized using bisect search
    let cellEls = this.refs.table.el.findAll('th,td')
    for (let i = 0; i < cellEls.length; i++) {
      let cellEl = cellEls[i]
      let rect = domHelpers.getBoundingRect(cellEl)
      if (domHelpers.isXInside(x, rect) && domHelpers.isYInside(y, rect)) {
        return cellEl.id
      }
    }
  }

  _nav(dr, dc, expand, selData) {
    selData = selData || this._getSelectionData()
    if (selData) {
      let newSelData = computeUpdatedSelection(this.props.node, selData, dr, dc, expand)
      this._requestSelectionChange(this._tableEditing.createTableSelection(newSelData))
    }
  }

  _getCustomResourceId() {
    return this.props.node.id
  }

  _clearSelection() {
    let selData = this._getSelectionData()
    if (selData) {
      this._tableEditing.clearValues(selData.anchorCellId, selData.focusCellId)
    }
  }

  rerenderDOMSelection() {
    // console.log('SheetComponent.rerenderDOMSelection()')
    this._positionSelection(this._getSelectionData())
    // // put the native focus into the keytrap so that we
    // // receive keyboard events
    this.refs.keytrap.el.focus()
  }

  _positionSelection(selData, focused) {
    // TODO: find a better criteria for integrity checking
    if (!selData) {
      this._hideSelection()
      return
    }
    let { anchorCellId, focusCellId } = selData

    let anchorCellComp = this._getActualCellComp(anchorCellId)
    let anchorRect = getRelativeBoundingRect(anchorCellComp.el, this.el)
    this.refs.selAnchor.css(this._getStylesForRectangle(anchorRect))

    if (!focused) {
      let rangeRect
      if (focusCellId === anchorCellId) {
        rangeRect = anchorRect
      } else {
        let focusCellComp = this._getActualCellComp(focusCellId)
        let focusRect = getRelativeBoundingRect(focusCellComp.el, this.el)
        rangeRect = domHelpers.getBoundingRectForRects(anchorRect, focusRect)
      }
      this.refs.selRange.css(this._getStylesForRectangle(rangeRect))
    } else {
      this.refs.selRange.css('visibility', 'hidden')
    }
  }

  _getActualCellComp(cellId) {
    let table = this._tableEditing.getTable()
    let cell = table.get(cellId)
    if (cell.shadowed) cell = cell.masterCell
    return this.refs[cell.id]
  }

  _hideSelection() {
    this.refs.selAnchor.css('visibility', 'hidden')
    this.refs.selRange.css('visibility', 'hidden')
  }

  _hideContextMenu() {
    this.refs.contextMenu.addClass('sm-hidden')
  }

  _showContextMenu(e) {
    let contextMenu = this.refs.contextMenu
    let offset = this.el.getOffset()
    contextMenu.css({
      display: 'block',
      top: e.clientY - offset.top,
      left: e.clientX - offset.left
    })
    contextMenu.removeClass('sm-hidden')
  }

  _getStylesForRectangle(rect) {
    let styles = { visibility: 'hidden' }
    if (rect) {
      Object.assign(styles, rect)
      if (isFinite(rect.top) && isFinite(rect.left) &&
        isFinite(rect.width) && isFinite(rect.height)) {
        styles.visibility = 'visible'
      }
    }
    return styles
  }
}
