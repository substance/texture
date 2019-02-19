import ToolPanel from './ToolPanel'

// TODO: refactor this. I don't like how this is tight to ScrollPane
export default class ContextMenu extends ToolPanel {
  didMount () {
    super.didMount()
    if (!this.context.scrollPane) {
      throw new Error('Requires a scrollPane context')
    }
    this.context.scrollPane.on('context-menu:opened', this._onContextMenuOpened, this)
  }

  dispose () {
    super.dispose()
    this.context.scrollPane.off(this)
  }

  render ($$) {
    let el = $$('div')
      .addClass(this._getClassNames())
      .addClass('sm-hidden')
      .addClass('sm-theme-' + this.getTheme())
    el.append(
      $$('div').addClass('se-active-tools').append(
        this._renderItems($$)
      ).ref('entriesContainer')
    )
    return el
  }

  show (hints) {
    this.el.removeClass('sm-hidden')
    this._position(hints)
  }

  hide () {
    this.el.addClass('sm-hidden')
  }

  _getClassNames () {
    return 'sc-context-menu'
  }

  /*
    Positions the content menu relative to the scrollPane
  */
  _onContextMenuOpened (hints) {
    let mouseBounds = hints.mouseBounds
    this.el.removeClass('sm-hidden')
    let contextMenuWidth = this.el.htmlProp('offsetWidth')

    // By default, context menu are aligned left bottom to the mouse coordinate clicked
    this.el.css('top', mouseBounds.top)
    let leftPos = mouseBounds.left
    // Must not exceed left bound
    leftPos = Math.max(leftPos, 0)
    // Must not exceed right bound
    let maxLeftPos = mouseBounds.left + mouseBounds.right - contextMenuWidth
    leftPos = Math.min(leftPos, maxLeftPos)
    this.el.css('left', leftPos)
  }
}
