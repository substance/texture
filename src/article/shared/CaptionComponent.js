import { Component } from 'substance'

// TODO: turn this into a Model based component
export default class CaptionComponent extends Component {
  render ($$) {
    const node = this.props.node

    let el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id)
    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Caption',
      node: node,
      disabled: this.props.disabled
    })
    el.append(contentEl)
    return el
  }
}
