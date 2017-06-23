import { Component } from 'substance'
import ContainerEditor from './TextureContainerEditor'

export default class ContainerNodeComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-'+node.type)
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
