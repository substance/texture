import { Component } from 'substance'
import CardComponent from '../shared/CardComponent'
import NodeModelEditor from '../../shared/NodeModelEditor'

export default class EditReferenceWorkflow extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'remove-item': this._removeReference
    })
  }

  render($$) {
    const item = this.props.item
    const ItemEditor = this.getComponent(item.type, true) || NodeModelEditor

    let el = $$('div').addClass('se-edit-reference').append(
      $$(CardComponent).append(
        $$(ItemEditor, {
          model: item
        })
      )
    )

    return el
  }

  _removeReference(item) {
    const api = this.context.api
    const collection = api.getModel('references')
    collection.removeItem(item)
    this.send('closeModal')
  }
}
