import { ContainerEditor } from 'substance'

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
export default class TextureContainerEditor extends ContainerEditor {
  _getNodeComponentClass (node) {
    let ComponentClass = this.getComponent(node.type, 'not-strict')
    if (!ComponentClass) {
      if (node.isText()) {
        return this.getComponent('text-node')
      } else {
        return this.getComponent('unsupported')
      }
    }
    return ComponentClass
  }

  _getNodeProps (node) {
    let props = super._getNodeProps(node)
    let model = this.context.api.getModel(node)
    props.model = model
    return props
  }
}
