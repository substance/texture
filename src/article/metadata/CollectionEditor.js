import { Component } from 'substance'
import CardComponent from '../shared/CardComponent'

export default class CollectionEditor extends Component {
  getActionHandlers () {
    return {
      'remove-item': this._removeCollectionItem
    }
  }

  render ($$) {
    const model = this.props.model
    const EntityEditor = this.getComponent('entity')
    let items = model.getItems()
    let el = $$('div').addClass('sc-collection-editor')
    items.forEach(item => {
      let ItemEditor = this.getComponent(item.type, true) || EntityEditor
      el.append(
        $$(CardComponent).append(
          $$(ItemEditor, {
            model: item,
            // LEGACY
            // TODO: try to get rid of this
            node: item._node
          })
        )
      )
    })
    return el
  }

  _removeCollectionItem (item) {
    const model = this.props.model
    model.removeItem(item)
    // TODO: this is only necessary for fake collection models
    // i.e. models that are only virtual, which I'd like to avoid
    this.rerender()
  }
}
