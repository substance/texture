import { Component } from 'substance'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import katex from 'katex'

export default class DispFormulaComponent extends Component {
  render ($$) {
    const node = this.props.node
    const mode = this.props.mode
    const model = this.props.model
    const texMath = model.getContent()
    const label = model.getLabel() || '?'

    let el = $$('div')
      .addClass('sc-disp-formula')
      .attr('data-id', node.id)

    if (mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: model.id,
          label: label,
          description: $$('div').html(katex.renderToString(texMath))
        })
      )
    } else {
      try {
        el.append(
          $$('span').addClass('se-formula').html(katex.renderToString(texMath))
        )
        let blockerEl = $$('div').addClass('se-blocker')
        el.append(blockerEl)
      } catch (error) {
        el.addClass('sm-error')
          .text(error.message)
      }
      el.append(
        $$('div').addClass('se-label').append(label)
      )
    }

    return el
  }
}
