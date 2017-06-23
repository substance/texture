import { ContainerEditor, IsolatedNodeComponent } from 'substance'

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
export default class TextureContainerEditor extends ContainerEditor {

  _renderNode($$, node) {
    if (!node) throw new Error("'node' is mandatory")
    let props = { node }
    let el
    let ComponentClass = this.getComponent(node.type, true)
    if (node.isText()) {
      if (ComponentClass) {
        el = $$(ComponentClass, props)
      } else {
        el = $$(this.getComponent('text-node'), props)
      }
    } else {
      if (ComponentClass) {
        if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
          el = $$(ComponentClass, props)
        } else {
          el = $$(IsolatedNodeComponent, props)
        }
      } else {
        el = $$(this.getComponent('unsupported'), props)
      }
    }
    el.ref(node.id)
    return el
  }

}
