import { ContainerEditor, IsolatedNodeComponent } from 'substance'


export default class ContainerComponent extends ContainerEditor {
  _renderNode ($$, node, nodeIndex) {
    
    let props = { node }
    if (!node) throw new Error('Illegal argument')
    if (node.isText()) {
      return this.renderNode($$, node, nodeIndex)
    } else {
      let componentRegistry = this.context.componentRegistry
      let ComponentClass = componentRegistry.get(node.type)
      if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
        return $$(ComponentClass, props).ref(node.id)
      } else {
        return $$(IsolatedNodeComponent, props).ref(node.id)
      }
    }
  }
}


