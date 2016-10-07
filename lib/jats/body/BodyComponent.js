import { Component, ContainerEditor } from 'substance'

class BodyComponent extends Component {

  render($$) {
    let node = this.props.node
    let configurator = this.props.configurator
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', this.props.node.id)

    el.append(
      $$(ContainerEditor, {
        disabled: this.props.disabled,
        node: node,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('body')
    )
    return el
  }
}

export default BodyComponent
