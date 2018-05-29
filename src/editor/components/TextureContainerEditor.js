import { ContainerEditor, IsolatedNodeComponent } from 'substance'

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
export default class TextureContainerEditor extends ContainerEditor {

  _renderNode($$, node) {
    let api = this.context.api
    if (!node) throw new Error("'node' is mandatory")

    let props = { node }
    let type = node.type
    let model = api.getModel(node)
    
    // NOTE: It would be better to change the `node` property to `model` so we see the different semantics.
    // However this may break too many things at once and requires two different implementations of ContainerEditor
    // which is why we push this for a bit.
    if (model) {
      props = { node: model }
      type = model.type
    } else {
      console.warn(`No model available for ${type}, using node directly...`)
    }

    let el
    let ComponentClass = this.getComponent(type, true)

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
