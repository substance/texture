import { Component } from 'substance'

export default class ArticleAbstractComponent extends Component {

  render($$) {
    const abstract = this.props.model

    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', abstract.id)

    el.append(
      $$('h1').addClass('sc-heading').append('Abstract')
    )

    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Abstract',
      name: 'abstractEditor',
      node: abstract.getContainerNode(),
      disabled: this.props.disabled
    })
    el.append(contentEl)

    return el
  }

}
