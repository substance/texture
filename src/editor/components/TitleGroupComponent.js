import { Component } from 'substance'

export default class TitleGroupComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-title-group')
      .attr('data-id', node.id)

    // article-title is mandatory
    const articleTitle = node.findChild('article-title')
    let titleEl = $$(this.getComponent('text-property-editor'), {
      path: articleTitle.getTextPath(),
      disabled: this.props.disabled
    }).addClass('se-article-title').ref('title')

    // TODO: sub-title etc.
    el.append(titleEl)

    return el
  }
}
