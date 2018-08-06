import { Component } from 'substance'
import CardComponent from '../shared/CardComponent'
import EntityEditor from '../shared/EntityEditor'

export default class EditReferenceWorkflow extends Component {
  render($$) {
    const item = this.props.item
    const ItemEditor = this.getComponent(item.type, true) || EntityEditor

    let el = $$('div').addClass('se-edit-reference').append(
      $$(CardComponent).append(
        $$(ItemEditor, {
          model: item
        })
      )
    )

    return el
  }
}
