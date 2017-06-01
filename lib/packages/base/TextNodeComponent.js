import { Component, TextPropertyComponent } from 'substance'

export default class TextNodeComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-'+node.type)
      .attr('data-id', node.id)
    el.append($$(TextPropertyComponent, {
      path: node.getPath()
    }).ref('text'))
    // TODO: ability to edit attributes
    return el
  }

}