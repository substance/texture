import { $$ } from 'substance'
import ToolPanel from './ToolPanel'

export default class Toolbar extends ToolPanel {
  render () {
    let el = $$('div').addClass('sc-toolbar')
    el.append(
      $$('div').addClass('se-active-tools').append(
        this._renderItems()
      ).ref('entriesContainer')
    )
    return el
  }
}
