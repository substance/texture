import { Component } from 'substance'

export default class ArticleTitleComponent extends Component {

  /*
    Renders `article-title`

    TODO: reduce markup overhead, we could return the read-only text-property editor directly
  */
  render($$) {
    const title = this.props.model
    let el = $$('div')
      .addClass('sc-article-title')
      .attr('data-id', title.id)

    let titleEl = $$(this.getComponent('text-property-editor'), {
      name: 'titleEditor',
      placeholder: 'Enter Title',
      path: title.getTextPath(),
      disabled: this.props.disabled
    }).ref('titleEditor')

    el.append(titleEl)

    return el
  }
}
