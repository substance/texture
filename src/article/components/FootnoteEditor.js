import { $$ } from 'substance'
import { ValueComponent } from '../../kit'
import FootnoteComponent from './FootnoteComponent'

// TODO: do we need this anymore?
export default class FootnoteEditor extends ValueComponent {
  render () {
    return $$('div').addClass('sc-table-footnotes-editor').append(
      this._renderFootnotes()
    )
  }

  _renderFootnotes () {
    let items = this._getDocument().resolve(this._getPath())
    return items.map(item => $$(FootnoteComponent, { node: item }).ref(item.id))
  }
}
