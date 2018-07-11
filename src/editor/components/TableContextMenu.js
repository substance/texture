import ToolPanel from '../../shared/ToolPanel'

export default class TableContextMenu extends ToolPanel {

  getEntryTypeComponents () {
    return Object.assign({}, super.getEntryTypeComponents(), {
      'tool-group': this.getComponent('menu-group'),
      'tool-dropdown': this.getComponent('menu-group')
    })
  }

  render ($$) {
    let el = $$('div').addClass('sc-table-context-menu sc-context-menu')
    el.append(this.renderEntries($$))
    return el
  }
}
