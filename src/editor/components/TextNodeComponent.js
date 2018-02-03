import { NodeComponent, TextPropertyComponent } from 'substance'

export default class TextNodeComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    const tagName = this.getTagName()

    let el = $$(tagName).addClass('sc-'+node.type)
      .append($$(TextPropertyComponent, {
        placeholder: this.props.placeholder,
        path: node.getPath()
      }).attr('data-id', node.id)
        .ref('text'))

    // TODO: ability to edit attributes
    return el
  }

  getTagName() {
    return 'div'
  }

}
