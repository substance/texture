import { NodeComponent } from '../../kit'
import katex from 'katex'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import { getLabel } from './nodeHelpers'

export default class BlockFormulaComponent extends NodeComponent {
  render ($$) {
    const mode = this.props.mode
    const node = this.props.node
    const label = getLabel(node) || '?'
    const source = node.content

    if (mode === PREVIEW_MODE) {
      return $$(PreviewComponent, {
        id: node.id,
        label,
        description: $$('div').html(katex.renderToString(source))
      })
    }

    let el = $$('div')
      .addClass('sc-disp-formula')
      .attr('data-id', node.id)

    if (!source) {
      el.append('?')
    } else {
      try {
        el.append(
          $$('span').addClass('se-formula').html(katex.renderToString(source))
        )
        el.append($$('div').addClass('se-blocker'))
      } catch (error) {
        el.addClass('sm-error')
          .text(error.message)
      }
    }

    el.append(
      $$('div').addClass('se-label').append(label)
    )

    return el
  }
}
