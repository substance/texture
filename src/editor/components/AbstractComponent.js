import { Component } from 'substance'

export default class AbstractComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', node.id)


    el.append(
      $$('h1').addClass('sc-heading').append('Abstract')
    )


    // There can be multiple abstracts. We just take the first
    const content = node.findChild('abstract-content')
    let contentEl
    if (content) {
      contentEl = $$(this.getComponent('container'), {
        placeholder: 'Enter Abstract',
        name: 'abstractEditor',
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
