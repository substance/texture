import { Component } from 'substance'

export default class DispQuote extends Component {
  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-disp-quote')
      .attr('data-id', node.id)

    let contentEl = $$(this.getComponent('container'), {
      node: node,
      disabled: this.props.disabled
    }).ref('editor')
    
    el.append(contentEl)

    return el
  }
}
