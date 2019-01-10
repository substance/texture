import { Component, documentHelpers } from 'substance'
import DefaultNodeComponent from '../shared/DefaultNodeComponent'
import CardComponent from '../shared/CardComponent'

export default class EditReferenceWorkflow extends Component {
  constructor (...args) {
    super(...args)
    this.handleActions({
      'remove-item': this._removeReference
    })
  }

  render ($$) {
    const node = this.props.node
    const ItemEditor = this.getComponent(node.type, true) || DefaultNodeComponent

    let el = $$('div').addClass('se-edit-reference').append(
      $$(CardComponent, { node }).append(
        $$(ItemEditor, { node })
      )
    )

    return el
  }

  _removeReference (reference) {
    let editorSession = this.context.editor
    let collectionPath = [reference.getParent().id, reference.xpath.property]
    editorSession.transaction(tx => {
      // TODO: shouldn't the reference be deleted?
      documentHelpers.remove(tx, collectionPath, reference.id)
    })
    this.send('closeModal')
  }
}
