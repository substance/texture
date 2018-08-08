import ToolPanel from './ToolPanel'

export default class ToolbarV2 extends ToolPanel {
  render ($$) {
    let el = $$('div').addClass('sc-toolbar')
    el.append(
      $$('div').addClass('se-active-tools').append(
        this.renderEntries($$)
      ).ref('entriesContainer')
    )
    return el
  }

  getTheme () {
    return this.props.theme || 'light'
  }
}
