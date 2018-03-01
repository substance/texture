import { Component, TextPropertyEditor } from 'substance'

export default class DispQuote extends Component {
  render($$) {
    const node = this.props.node
    let quoteContent = node.find('disp-quote-content')
    let attribContent = node.find('attrib')

    let el = $$('div')
      .addClass('sc-disp-quote')
      .attr('data-id', node.id)

    let quoteContentEl = $$(this.getComponent('container'), {
      node: quoteContent,
      disabled: this.props.disabled,
      placeholder: 'Blockquote'
    }).ref('editor')

    let attribContentEl = $$(TextPropertyEditor, {
      placeholder: 'Enter attribution',
      path: attribContent.getPath(),
      disabled: this.props.disabled
    }).addClass('se-attribution')

    el.append(
      quoteContentEl,
      attribContentEl
    )

    return el
  }
}
