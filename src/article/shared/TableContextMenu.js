import { ToolPanel } from '../../kit'

export default class TableContextMenu extends ToolPanel {
  getEntryTypeComponents () {
    return Object.assign({}, super.getEntryTypeComponents(), {
      'group': this.getComponent('menu-group'),
      'dropdown': this.getComponent('menu-group')
    })
  }

  render ($$) {
    let el = $$('div').addClass('sc-table-context-menu sc-context-menu')
    el.append(this.renderEntries($$))
    return el
  }
}
