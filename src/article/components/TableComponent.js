import {
  Component, CustomSurface, platform,
  DefaultDOMElement as DOM, domHelpers, getRelativeBoundingRect,
  keys, getKeyForPath
} from 'substance'
import { Managed, Clipboard } from '../../kit'
import { getCellRange, computeUpdatedSelection, createTableSelection } from '../shared/tableHelpers'
import TableCellComponent from './TableCellComponent'
import TableContextMenu from './TableContextMenu'

export default class TableComponent extends CustomSurface {
  constructor (...args) {
    super(...args)

    this._selectionData = {}
    this._clipboard = new Clipboard()
  }

  getChildContext () {
    return {
      surface: this,
      parentSurfaceId: this.getId(),
      // HACK: nulling this so that nested surfaces get an id that are relative to
      // this surface instead of the isolatedNodeComponent
      isolatedNodeComponent: null
    }
  }

  shouldRerender (newProps) {
    return (newProps.node !== this.props.node || newProps.disabled !== this.props.disabled)
  }

  didMount () {
    super.didMount()

    this._tableSha = this.props.node._getSha()
    const appState = this.context.editorState

    appState.addObserver(['document'], this._onDocumentChange, this, { stage: 'render' })
    appState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'render' })

    this._positionSelection(this._getSelectionData())
  }

  dispose () {
    super.dispose()

    const appState = this.context.editorState
    appState.off(this)
  }

  render ($$) {
    let el = $$('div').addClass('sc-table')
    el.on('mousedown', this._onMousedown)
      .on('mouseup', this._onMouseup)
      .on('click', this._prevent)
    el.append(this._renderTable($$))
    el.append(this._renderKeyTrap($$))
    el.append(this._renderUnclickableOverlays($$))
    // el.append(this._renderClickableOverlays($$))
    el.append(this._renderContextMenu($$))
    return el
  }

  _renderTable ($$) {
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
      .on('contextmenuitemclick', this._onContextMenuItemClick)
    return table
  }

  _renderKeyTrap ($$) {
    return $$('textarea').addClass('se-keytrap').ref('keytrap')
      .css({ position: 'absolute', width: 0, height: 0, opacity: 0 })
      .on('keydown', this._onKeydown)
      .on('input', this._onInput)
      .on('copy', this._onCopy)
      .on('paste', this._onPaste)
      .on('cut', this._onCut)
  }

  _renderUnclickableOverlays ($$) {
    let el = $$('div').addClass('se-unclickable-overlays')
    el.append(
      this._renderSelectionOverlay($$)
    )
    el.append(
      this.props.unclickableOverlays
    )
    return el
  }

  _renderSelectionOverlay ($$) {
    let el = $$('div').addClass('se-selection-overlay')
    el.append(
      $$('div').addClass('se-selection-anchor').ref('selAnchor').css('visibility', 'hidden'),
      $$('div').addClass('se-selection-range').ref('selRange').css('visibility', 'hidden')
    )
    return el
  }

  _renderContextMenu ($$) {
    const config = this.context.config
    let contextMenu
    const items = config.getToolPanel('table-context-menu')
    if (items) {
      contextMenu = $$(Managed(TableContextMenu), {
        items,
        bindings: ['commandStates']
      })
    } else {
      contextMenu = $$('div')
    }
    contextMenu.ref('contextMenu')
      .addClass('se-context-menu')
      .css({ display: 'none' })
    return contextMenu
  }

  _onDocumentChange () {
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

  _onSelectionChange () {
    const doc = this.context.editorSession.getDocument()
    const sel = this.context.editorState.selection
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
        let cell = doc.get(this._activeCell)
        this._positionSelection({
          type: 'range',
          anchorCellId: cell.id,
          focusCellId: cell.id
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

    function _disableActiveCell () {
      const activeCellId = self._activeCell
      if (activeCellId) {
        let cellEditor = self.refs[activeCellId]
        if (cellEditor) {
          // console.log('DISABLING CELL EDITOR', activeCellId)
          cellEditor.extendProps({ disabled: true })
        }
        self._activeCell = null
      }
    }
  }

  _onMousedown (e) {
    // console.log('TableComponent._onMousedown()')
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
    let targetInfo = this._getClickTargetForEvent(e)
    // console.log('target', target)
    if (!targetInfo) return

    let isRightButton = domHelpers.isRightButton(e)
    if (isRightButton) {
      // console.log('IS RIGHT BUTTON')
      // this will be handled by onContextMenu
      if (targetInfo.type === 'cell') {
        let targetCell = this.props.node.get(targetInfo.id)
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
          selData.anchorCellId = targetInfo.id
          selData.focusCellId = targetInfo.id
          this._requestSelectionChange(this._createTableSelection(selData))
        }
      }
      return
    }
    if (targetInfo.type === 'cell') {
      this._isSelecting = true
      selData.focusCellId = targetInfo.id
      if (!e.shiftKey) {
        selData.anchorCellId = targetInfo.id
      }
      e.preventDefault()
      this._requestSelectionChange(this._createTableSelection(selData))
    }
  }

  _onMouseup (e) {
    e.stopPropagation()
    if (this._isSelecting) {
      e.preventDefault()
      this._isSelecting = false
    }
  }

  _onMousemove (e) {
    if (this._isSelecting) {
      const selData = this._selectionData
      let cellId = this._mapClientXYToCellId(e.clientX, e.clientY)
      if (cellId !== selData.focusCellId) {
        selData.focusCellId = cellId
        this._requestSelectionChange(this._createTableSelection(selData))
      }
    }
  }

  _onDblclick (e) {
    e.preventDefault()
    e.stopPropagation()
    this._requestEditCell()
  }

  _onKeydown (e) {
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
  _onInput () {
    const value = this.refs.keytrap.val()
    this._requestEditCell(value)
    // Clear keytrap after sending an action
    this.refs.keytrap.val('')
  }

  _onCellEnter (e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    if (e.detail.shiftKey) {
      this.context.api.getTableAPI().insertSoftBreak()
    } else {
      let cellId = _getCellId(cellEl)
      this._nav(1, 0, false, { anchorCellId: cellId, focusCellId: cellId })
    }
  }

  _onCellTab (e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    let cellId = _getCellId(cellEl)
    this._nav(0, 1, false, { anchorCellId: cellId, focusCellId: cellId })
  }

  _onCellEscape (e) {
    e.stopPropagation()
    e.preventDefault()
    let cellEl = DOM.wrap(e.target).getParent()
    let cellId = _getCellId(cellEl)
    this._requestSelectionChange(this._createTableSelection({ anchorCellId: cellId, focusCellId: cellId }))
  }

  _onCopy (e) {
    e.preventDefault()
    e.stopPropagation()
    let clipboardData = e.clipboardData
    this._clipboard.copy(clipboardData, this.context)
  }

  _onCut (e) {
    e.preventDefault()
    e.stopPropagation()
    let clipboardData = e.clipboardData
    this._clipboard.cut(clipboardData, this.context)
  }

  _onPaste (e) {
    e.preventDefault()
    e.stopPropagation()
    let clipboardData = e.clipboardData
    // TODO: allow to force plain-text paste
    this._clipboard.paste(clipboardData, this.context)
  }

  _onContextMenu (e) {
    e.preventDefault()
    e.stopPropagation()
    this._showContextMenu(e)
  }

  _onContextMenuItemClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this._hideContextMenu()
  }

  _getSelection () {
    return this.context.editorSession.getSelection()
  }

  _getSelectionData () {
    let sel = this._getSelection()
    if (sel && sel.surfaceId === this.getId()) {
      return sel.data
    }
  }

  _requestEditCell (initialValue) {
    let selData = this._getSelectionData()
    if (selData) {
      // type over cell
      if (initialValue) {
        // TODO: is there a more common action to describe this?
        // seems that this is like 'typing'
        // Otherwise it is only setting the selection
        this._getTableApi().insertText(initialValue)
      } else {
        // TODO: do we have a general API to set the selection
        // into a specific editor?
        const doc = this.props.node.getDocument()
        let cell = doc.get(selData.anchorCellId)
        let path = cell.getPath()
        // TODO: we need low-level API to set the selection
        this.context.api._setSelection({
          type: 'property',
          path,
          startOffset: cell.getLength(),
          surfaceId: this.getId() + '/' + getKeyForPath(path)
        })
      }
    }
  }

  _requestSelectionChange (newSel) {
    // console.log('requesting selection change', newSel)
    this.context.editorSession.setSelection(newSel)
  }

  _getClickTargetForEvent (e) {
    let target = DOM.wrap(e.target)
    let cellEl = domHelpers.findParent(target, 'td,th')
    if (cellEl) {
      let cellId = _getCellId(cellEl)
      return { type: 'cell', id: cellId }
    }
  }

  _getRowCol (cellEl) {
    let rowIdx = parseInt(cellEl.getAttribute('data-row-idx'), 10)
    let colIdx = parseInt(cellEl.getAttribute('data-col-idx'), 10)
    return [rowIdx, colIdx]
  }

  _mapClientXYToCellId (x, y) {
    // TODO: this could be optimized using bisect search
    let cellEls = this.refs.table.el.findAll('th,td')
    for (let i = 0; i < cellEls.length; i++) {
      let cellEl = cellEls[i]
      let rect = domHelpers.getBoundingRect(cellEl)
      if (domHelpers.isXInside(x, rect) && domHelpers.isYInside(y, rect)) {
        return _getCellId(cellEl)
      }
    }
  }

  _nav (dr, dc, expand, selData) {
    selData = selData || this._getSelectionData()
    if (selData) {
      let newSelData = computeUpdatedSelection(this.props.node, selData, dr, dc, expand)
      this._requestSelectionChange(this._createTableSelection(newSelData))
    }
  }

  _getCustomResourceId () {
    return this.props.node.id
  }

  _clearSelection () {
    let selData = this._getSelectionData()
    if (selData) {
      this._getTableApi().deleteSelection()
    }
  }

  rerenderDOMSelection () {
    // console.log('SheetComponent.rerenderDOMSelection()')
    this._positionSelection(this._getSelectionData())
    // // put the native focus into the keytrap so that we
    // // receive keyboard events
    this.refs.keytrap.el.focus({ preventScroll: true })
  }

  _positionSelection (selData, focused) {
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

  _getActualCellComp (cellId) {
    let table = this.props.node
    let cell = table.getCellById(cellId)
    if (cell.shadowed) cell = cell.masterCell
    return this.refs[cell.id]
  }

  _hideSelection () {
    this.refs.selAnchor.css('visibility', 'hidden')
    this.refs.selRange.css('visibility', 'hidden')
  }

  _hideContextMenu () {
    this.refs.contextMenu.addClass('sm-hidden')
  }

  _showContextMenu (e) {
    let contextMenu = this.refs.contextMenu
    let offset = this.el.getOffset()
    contextMenu.css({
      display: 'block',
      top: e.clientY - offset.top,
      left: e.clientX - offset.left
    })
    contextMenu.removeClass('sm-hidden')
  }

  _getStylesForRectangle (rect) {
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

  _createTableSelection (selData) {
    let tableId = this.props.node.id
    let surfaceId = this.getId()
    let sel = createTableSelection(tableId, selData, surfaceId)
    return sel
  }

  _getTableApi () {
    return this.context.api.getTableAPI()
  }

  _prevent (event) {
    event.stopPropagation()
    event.preventDefault()
  }
}

function _getCellId (cellEl) {
  return Component.unwrap(cellEl).getId()
}
