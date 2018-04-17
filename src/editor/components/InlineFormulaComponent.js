import { NodeComponent } from 'substance'
import katex from 'katex'

export default class InlineFormulaComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    // TODO: Find out why node.find('tex-math') returns null here
    const texMath = node.findChild('tex-math').textContent
    // TODO: Use KaTeX

    const el = $$('span').addClass('sc-math')

    try {
      el.html(
        katex.renderToString(texMath)
      )
    } catch (error) {
      el.addClass('sm-error')
        .text(error.message)
    }

    return el
  }
}
