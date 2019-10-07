import { $$ } from 'substance'
import { ToolPanel } from '../../kit'

export default class TableContextMenu extends ToolPanel {
  render () {
    let el = $$('div').addClass('sc-table-context-menu sc-context-menu')
    el.append(
      $$('div').append(
        this._renderItems()
      ).ref('entriesContainer')
    )
    return el
  }
}
