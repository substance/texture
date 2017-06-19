import { NodeComponent, TextPropertyComponent } from 'substance'

export default class TextNodeComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    const tagName = this.getTagName()

    let el = $$(tagName).addClass('sc-'+node.type)
      .attr('data-id', node.id)

    el.append($$(TextPropertyComponent, {
      path: node.getPath()
    }).ref('text'))

    // TODO: ability to edit attributes
    return el
  }

  getTagName() {
    return 'div'
  }

}