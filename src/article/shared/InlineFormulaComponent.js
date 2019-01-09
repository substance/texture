import { NodeComponent } from '../../kit'
import katex from 'katex'

export default class InlineFormulaComponent extends NodeComponent {
  // ATTENTION: this is very similar to BlockFormulaComponent
  // but unfortunately also substantially different
  // e.g. has no blocker, elements are spans, error message as tooltip
  render ($$) {
    const node = this.props.node
    let el = $$('span')
      .addClass('sc-inline-formula')
      .attr('data-id', node.id)
    let source = node.content
    if (!source) {
      el.append('?')
    } else {
      try {
        el.append(
          $$('span').addClass('se-formula').html(katex.renderToString(source))
        )
      } catch (error) {
        el.addClass('sm-error')
          .append('\u26A0')
          .append($$('span').addClass('se-message').text(error.message))
      }
    }
    return el
  }
}
