import {
  ValueComponent
} from '../../kit'
import FootnoteComponent from './FootnoteComponent'

export default class FootnoteEditor extends ValueComponent {
  render ($$) {
    return $$('div').addClass('sc-table-footnotes-editor').append(
      this._renderChildren($$)
    )
  }

  _renderChildren ($$) {
    const model = this.props.model
    let children = model.getChildren()
    return children.map(child => $$(FootnoteComponent, { model: child, node: child._node }).ref(child.id))
  }
}
