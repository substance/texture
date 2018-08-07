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
      node: front
    }).ref('front'))

    const body = article.findChild('body')
    if (body) {
      const BodyComponent = this.getComponent('body')
      el.append($$(BodyComponent, {
        node: body
      }).ref('body'))
    }

    const back = article.findChild('back')
    if (back) {
      const BackComponent = this.getComponent('back')
      el.append($$(BackComponent, {
        node: back
      }).ref('back'))
    }

    return el
  }
}
