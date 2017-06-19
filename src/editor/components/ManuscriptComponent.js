import { Component } from 'substance'

export default class ManuscriptComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-article')
      .attr('data-id', node.id)

    const FrontComponent = this.getComponent('front')
    el.append($$(FrontComponent, {
      node: node.findChild('front')
    }).ref('front'))

    const BodyComponent = this.getComponent('body')
    el.append($$(BodyComponent, {
      node: node.findChild('body')
    }).ref('body'))

    const BackComponent = this.getComponent('back')
    el.append($$(BackComponent, {
      node: node.findChild('back')
    }).ref('back'))

    return el
  }

}
