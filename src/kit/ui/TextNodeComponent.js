import { Component } from 'substance'

export default class TextNodeComponent extends Component {
  /*
    ATTENTION: There is another mechanism which leads to rerendering of TextPropertyComponents (-> MarkersManager)
    HACK: To avoid double rendering of text nodes, we do not register for updates here
    TODO: rethink this.
  */
  didMount () {}

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
    return 'sc-text-node sm-' + this.props.node.type
  }
}
