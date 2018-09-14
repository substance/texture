import { Component } from 'substance'

/*
  TODO: try to get rid of this by switching to a pure model based approach
  ATM, we need this for legacy reasons: e.g. it is used by FlowContentComponent
  for text nodes without a registered model.

  ATTENTION: There is another mechanism which leads to rerendering of TextPropertyComponents (-> MarkersManager)
  HACK: To avoid double rendering of text nodes, we do not register for updates here
  TODO: rethink this.
*/
export default class TextNodeComponent extends Component {
  render ($$) {
    const TextPropertyComponent = this.getComponent('text-property')
    const node = this.props.node
    const tagName = this.getTagName()
    const path = node.getPath()
    let el = $$(tagName)
      .addClass(this.getClassNames())
      .attr('data-id', node.id)
    el.append(
      $$(TextPropertyComponent, {
        doc: node.getDocument(),
        name: path.join('.'),
        path,
        placeholder: this.props.placeholder
      }).ref('text')
    )
    // TODO: ability to edit attributes
    return el
  }

  getTagName () {
    return 'div'
  }

  getClassNames () {
    // TODO: don't violate the 'sc-' contract
    return 'sc-text-node sc-' + this.props.node.type
  }
}
