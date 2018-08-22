import NodeComponent from './NodeComponent'
import TextInput from './TextInput'

/*
  TODO: try to get rid of this by switching to a pure model based approach
  ATM, we need this for legacy reasons: e.g. it is used by FlowContentComponent
  for text nodes without a registered model.
*/
export default class TextNodeComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const tagName = this.getTagName()
    const path = node.getPath()
    let el = $$(tagName)
      .addClass(this.getClassNames())
      .attr('data-id', node.id)
    el.append(
      $$(TextInput, {
        name: path.join('.'),
        path
      }).ref('text')
    )
    // TODO: ability to edit attributes
    return el
  }

  getTagName () {
    return 'div'
  }

  getClassNames () {
    return 'sc-' + this.props.node.type
  }
}
