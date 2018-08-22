import { Component } from 'substance'

export default class ContainerNodeComponent extends Component {
  render ($$) {
    const node = this.props.node
    const ContainerEditor = this.getComponent('container-editor')

    let el = $$('div').addClass('sc-' + node.type)
      .attr('data-id', node.id)
    el.append($$(ContainerEditor, {
      placeholder: this.props.placeholder,
      name: this.props.name,
      containerId: node.id,
      disabled: this.props.disabled
    }).ref('container'))
    // TODO: ability to edit attributes
    return el
  }
}
