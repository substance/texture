import { NodeComponent } from 'substance'
import katex from 'katex'

export default class InlineFormulaComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    // TODO: Find out why node.find('tex-math') returns null here
    const texMath = node.findChild('tex-math')
    const el = $$('span').addClass('sc-inline-formula')
    el.append(
      $$(TexMathComponent, {
        node: texMath
      })
    )
    if (this.props.isolatedNodeState) {
      el.addClass('sm-'+this.props.isolatedNodeState)
    }
    return el
  }
}

class TexMathComponent extends NodeComponent {
  render($$) {
    const node = this.props.node
    const texMath = node.textContent
    const el = $$('span').addClass('sc-math')
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
