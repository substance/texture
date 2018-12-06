import { Component } from 'substance'

// TODO: turn this into a Model based component, also it should be able to reuse an existing component
export default class CaptionComponent extends Component {
  render ($$) {
    const Container = this.getComponent('container')
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id)
    let contentEl = $$(Container, {
      placeholder: 'Enter Caption',
      node: node,
      disabled: this.props.disabled
    }).ref('content')
    el.append(contentEl)
    return el
  }
}
