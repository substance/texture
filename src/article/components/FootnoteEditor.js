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
    const model = this.props.model
    let items = model.getItems()
    return items.map(item => $$(FootnoteComponent, { node: item }).ref(item.id))
  }
}
