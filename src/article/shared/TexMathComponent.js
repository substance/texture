import { NodeComponent } from '../../kit'
import katex from 'katex'

export default class TexMathComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const texMath = node.textContent
    const el = $$('span').addClass('sc-math')
    if (!texMath) {
      el.append('???')
    } else {
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
    }
    return el
  }
}
