import { ModelComponent } from '../../kit'
import { METADATA_MODE } from '../ArticleConstants'
import CardComponent from '../shared/CardComponent'

// Note: This is used for values of type 'collection'
// where every item is rendered as a single card
export default class MetadataCollectionComponent extends ModelComponent {
  render ($$) {
    const model = this.props.model
    let items = model.getItems()
    let el = $$('div').addClass('sc-collection-editor')
    items.forEach(item => {
      let ItemEditor = this._getItemComponentClass(item)
      el.append(
        $$(CardComponent, {
          node: item,
          label: item.type
        }).append(
          $$(ItemEditor, {
            node: item,
            mode: METADATA_MODE
          }).ref(item.id)
        )
      )
    })
    return el
  }

  // TODO: this should go into a common helper
  _getItemComponentClass (item) {
    let ItemComponent = this.getComponent(item.type, true)
    if (!ItemComponent) {
      // try to find a component registered for a parent type
      ItemComponent = this._getParentTypeComponent(item)
    }
    return ItemComponent || this.getComponent('entity')
  }

  // TODO: this should go into a common helper
  _getParentTypeComponent (node) {
    let superTypes = node.getSchema().getSuperTypes()
    for (let type of superTypes) {
      let NodeComponent = this.getComponent(type, true)
      if (NodeComponent) return NodeComponent
    }
  }
}
