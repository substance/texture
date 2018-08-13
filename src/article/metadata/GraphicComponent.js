import { Component } from 'substance'

export default class GraphicComponent extends Component {
  render ($$) {
    const model = this.props.model
    // TODO: implement this based on a GraphicModel
    let url
    let el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', model.id)
    el.append(
      $$('img').attr({src: url}).ref('image')
    )
    return el
  }
}
