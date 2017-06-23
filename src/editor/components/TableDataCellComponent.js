import { NodeComponent } from 'substance'

export default class TableDataCellComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('td')
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
