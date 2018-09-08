import { ModelComponent } from '../../kit'
import { METADATA_MODE } from '../ArticleConstants'
import CardComponent from '../shared/CardComponent'

export default class CollectionEditor extends ModelComponent {
  getActionHandlers () {
    return {
      'remove-item': this._removeCollectionItem
    }
  }

  render ($$) {
    const model = this.props.model
    let items = model.getItems()
    let el = $$('div').addClass('sc-collection-editor')
    items.forEach(item => {
      let ItemEditor = this._getItemComponentClass(item)
      el.append(
        $$(CardComponent, {label: item.type}).append(
          $$(ItemEditor, {
            model: item,
            mode: METADATA_MODE,
            node: item._node
          }).ref(item.id)
        )
      )
    })
    return el
  }

  _getItemComponentClass (item) {
    let ItemComponent = this.getComponent(item.type, true)
    if (!ItemComponent) {
      // try to find a component registered for a parent type
      if (item._node) {
        ItemComponent = this._getParentTypeComponent(item._node)
      }
    }
    return ItemComponent || this.getComponent('entity')
  }

  _getParentTypeComponent (node) {
    let superTypes = node.getSchema().getSuperTypes()
    for (let type of superTypes) {
      let NodeComponent = this.getComponent(type, true)
      if (NodeComponent) return NodeComponent
    }
  }

  _removeCollectionItem (item) {
    const model = this.props.model
    model.removeItem(item)
  }
}
