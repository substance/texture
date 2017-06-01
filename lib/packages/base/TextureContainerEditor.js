import { ContainerEditor, IsolatedNodeComponent } from 'substance'

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
export default class TextureContainerEditor extends ContainerEditor {

  _renderNode($$, node) {
    if (!node) throw new Error("'node' is mandatory")
    let el
    if (node.isText()) {
      el = $$(this.getComponent('text'), { node })
    } else {
      let ComponentClass = this.getComponent(node.type, true)
      if (ComponentClass) {
        if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
          el = $$(ComponentClass, { node: node })
        } else {
          el = $$(IsolatedNodeComponent, { node: node })
        }
      } else {
        el = $$(this.getComponent('unsupported'), { node })
      }
    }
    el.ref(node.id)
    return el
  }

}
