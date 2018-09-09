import { Component } from 'substance'

export default class BioComponent extends Component {
  render ($$) {
    const node = this.props.node

    let el = $$('div')
      .addClass('sc-bio')
      .attr('data-id', node.id)

    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Bio',
      node: node
    })
    el.append(contentEl)
    return el
  }
}
