import { Component } from 'substance'

export default class GraphicComponent extends Component {

  render($$) {
    const node = this.props.node
    const url = node.getAttribute('xlink:href')

    let el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', node.id)
    el.append(
      $$('img').attr({src: url}).ref('image')
    )
    return el
  }
}
