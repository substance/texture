import { Component } from 'substance'
import TexMathComponent from './TexMathComponent'
import katex from 'katex'

export default class DispFormulaComponent extends Component {
  render ($$) {
    const model = this.props.model
    const label = model.getLabel()
    const texMath = model.getContent()
    const el = $$('div').addClass('sc-disp-formula')
    el.append(
      $$('div').addClass('se-label').append(label)
    )
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
