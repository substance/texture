import { Component } from 'substance'

class GraphicComponent extends Component {

  render($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', node.id)
    el.append(
      $$('img').attr({
        src: node.getHref()
      })
    )
    return el
  }
}

export default GraphicComponent
