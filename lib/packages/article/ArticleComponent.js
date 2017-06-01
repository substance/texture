import { Component } from 'substance'

export default class ArticleComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-article')
      .attr('data-id', node.id)

    const FrontComponent = this.getComponent('front')
    el.append($$(FrontComponent, {
      node: node.get('front')
    }).ref('front'))

    const ContainerComponent = this.getComponent('container')
    el.append($$(ContainerComponent, {
      node: node.get('body')
    }).ref('body'))

    const BackComponent = this.getComponent('back')
    el.append($$(BackComponent, {
      node: node.get('back')
    }).ref('back'))

    return el
  }

}
