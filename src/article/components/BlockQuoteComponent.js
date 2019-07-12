import { NodeComponent } from '../../kit'

export default class BlockQuoteComponent extends NodeComponent {
  render ($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-block-quote')
      .attr('data-id', node.id)

    el.append(
      this._renderValue($$, 'content', { placeholder: this.getLabel('content-placeholder') }),
      this._renderValue($$, 'attrib', { placeholder: this.getLabel('attribution-placeholder') })
    )
    return el
  }
}
