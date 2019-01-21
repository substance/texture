import { NodeComponent } from '../../kit'

export default class BlockQuoteComponent extends NodeComponent {
  render ($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-block-quote')
      .attr('data-id', node.id)

    el.append(
      this._renderValue($$, 'content'),
      this._renderValue($$, 'attrib')
    )
    return el
  }
}
