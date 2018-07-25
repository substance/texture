import { Component } from 'substance'

export default class ManuscriptComponent extends Component {

  render($$) {
    const article = this.props.node
    let el = $$('div')
      .addClass('sc-article')
      .attr('data-id', article.id)

    // front is mandatory
    const front = article.findChild('front')
    const FrontComponent = this.getComponent('front')
    el.append($$(FrontComponent, {
      node: front,
      disabled: this.props.disabled
    }).ref('front'))

    // body is optional
    // TODO: do we really want this? Otherwise we need to change InternalArticle
    // and create an empty body on import
    const body = article.findChild('body')
    if (body) {
      // el.append($$(this.getComponent('separator'), {
      //   label: 'manuscript-start'
      // }))
      const BodyComponent = this.getComponent('body')
      el.append($$(BodyComponent, {
        disabled: this.props.disabled,
        node: body
      }).ref('body'))
      // el.append($$(this.getComponent('separator'), {
      //   label: 'manuscript-end'
      // }))
    }

    const back = article.findChild('back')
    if (back) {
      const BackComponent = this.getComponent('back')
      el.append($$(BackComponent, {
        node: back,
        disabled: this.props.disabled
      }).ref('back'))
    }

    return el
  }

}
