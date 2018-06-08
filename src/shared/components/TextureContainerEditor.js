import { ContainerEditor } from 'substance'

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
export default class TextureContainerEditor extends ContainerEditor {
  // overriding the default implementation, to control the behavior
  // for nodes without explicitly registered component
  _getNodeComponentClass (node) {
    let ComponentClass = this.getComponent(node.type, 'not-strict')
    if (ComponentClass) {
      // text components are used directly
      if (node.isText()) {
        return ComponentClass
      // other components are wrapped into an IsolatedNodeComponent
      // except the component is itself a customized IsolatedNodeComponent
      } else if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
        return ComponentClass
      } else {
        return this.getComponent('isolated-node')
      }
    } else {
      // for text nodes without an component registered explicitly
      // we use the default text component
      if (node.isText()) {
        return this.getComponent('text-node')
      // otherwise component for unsupported nodes
      } else {
        return this.getComponent('unsupported')
      }
    }
  }

  _getNodeProps (node) {
    let props = super._getNodeProps(node)
    let model = this.context.api.getModel(node)
    props.model = model
    return props
  }
}
