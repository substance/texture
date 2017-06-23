import ElementNodeComponent from './ElementNodeComponent'

export default class TableRowComponent extends ElementNodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('tr')
    node.childNodes.forEach(child => {
      let doc = this.context.doc
      let childNode = doc.get(child)
      let comp = this.getComponent(childNode.type)
      if(comp) {
        el.append($$(comp, {node: childNode}))
      }
    })

    return el
  }
}
