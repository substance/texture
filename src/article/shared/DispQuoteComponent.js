import { Component } from 'substance'

export default class DispQuoteComponent extends Component {
  render ($$) {
    const node = this.props.node
    const ContainerEditor = this.getComponent('container-editor')
    const TextPropertyEditor = this.getComponent('text-property-editor')

    let el = $$('div')
      .addClass('sc-disp-quote')
      .attr('data-id', node.id)

    let quoteContentEl = $$(ContainerEditor, {
      placeholder: 'Enter Blockquote',
      node,
      disabled: this.props.disabled
    }).ref('editor')

    let attribContentEl = $$(TextPropertyEditor, {
      placeholder: 'Enter attribution',
      path: [node.id, 'attrib'],
      disabled: this.props.disabled
    }).addClass('se-attribution')

    el.append(
      quoteContentEl,
      attribContentEl
    )
    return el
  }
}
