import { Component } from 'substance'

export default class BodyComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', node.id)

    // There can be multiple abstracts. We just take the first
    const content = node.get('body-content')
    let contentEl
    if (content) {
      contentEl = $$(this.getComponent('container'), {
        node: content,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add an abstract
    }
    el.append(contentEl)

    return el
  }

}
