import { NodeComponent } from 'substance'
import katex from 'katex'

export default class InlineFormulaComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    // TODO: Find out why node.find('tex-math') returns null here
    const texMath = node.findChild('tex-math').textContent
    // TODO: Use KaTeX

    const el = $$('span').addClass('sc-math')

    if (this.props.isolatedNodeState) {
      el.addClass('sm-'+this.props.isolatedNodeState)
    }

    try {
      el.append(
        $$('span').html(katex.renderToString(texMath))

      )
      let blockerEl = $$('div').addClass('se-blocker')
      el.append(blockerEl)
    } catch (error) {
      el.addClass('sm-error')
        .text(error.message)
    }

    return el
  }
}
