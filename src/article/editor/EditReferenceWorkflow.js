import { Component } from 'substance'
import { NodeModelEditor } from '../../kit'
import CardComponent from '../shared/CardComponent'

export default class EditReferenceWorkflow extends Component {
  constructor (...args) {
    super(...args)
    this.handleActions({
      'remove-item': this._removeReference
    })
  }

  render ($$) {
    const model = this.props.model
    const ItemEditor = this.getComponent(model.type, true) || NodeModelEditor

    let el = $$('div').addClass('se-edit-reference').append(
      $$(CardComponent).append(
        $$(ItemEditor, {
          model: model
        })
      )
    )

    return el
  }

  _removeReference (model) {
    const api = this.context.api
    const collection = api.getCollectionForType('reference')
    collection.removeItem(model)
    this.send('closeModal')
  }
}
