import ToolPanel from './ToolPanel'

export default class Toolbar extends ToolPanel {
  render ($$) {
    let el = $$('div').addClass('sc-toolbar')
    el.append(
      $$('div').addClass('se-active-tools').append(
        this._renderEntries($$)
      ).ref('entriesContainer')
    )
    return el
  }

  _rerender (...args) {
    super._rerender(...args)
  }

  getTheme () {
    return this.props.theme || 'light'
  }
}
