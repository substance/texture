import { Component } from 'substance'

export default class CaptionComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id)
    let contentEl = $$(this.getComponent('container'), {
      node: node,
      disabled: this.props.disabled
    })
    el.append(contentEl)
    return el
  }

}
