import { Component } from 'substance'

/*
  TODO: this implementation raises a bunch of questions:
    - do we want to use the same components for editor and reader?
    - or should there be two different implementations
    - How do we get closer to the model oriented implementation?
      having a node oriented implementation for sake of legacy only
*/
export default class ContainerNodeComponent extends Component {
  render ($$) {
    const container = this.props.node
    const api = this.context.api

    let el = $$('div')
      .addClass('sc-container-node')
      .addClass('sm-' + container.type)
      .attr('data-id', container.id)

    let nodes = container.getNodes()
    el.append(
      nodes.map(node => {
        let model = api.getModelById(node.id)
        let NodeComponent = this.getComponent(node.type)
        if (!NodeComponent) {
          console.error('No component registered for type ', node.type)
        } else {
          return $$(NodeComponent, {
            node,
            model
          })
        }
      })
    )
    return el
  }
}
