import { NodeComponent } from '../../kit'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class ReferenceComponent extends NodeComponent {
  render ($$) {
    const refNode = this.getNode()
    let label = _getReferenceLabel(refNode)
    let html = this.context.api.renderEntity(refNode)
    // TODO: do we want to display something like this
    // if so, use the label provider
    html = html || '<i>Not available</i>'
    if (this.props.mode === PREVIEW_MODE) {
      // NOTE: We return PreviewComponent directly, to prevent inheriting styles from .sc-reference
      return $$(PreviewComponent, {
        id: this.props.model.id,
        label: label,
        description: $$('div').html(html)
      })
    } else {
      let el = $$('div').addClass('sc-reference')
      el.append(
        $$('div').addClass('se-label').append(label),
        $$('div').addClass('se-text').html(html)
      ).attr('data-id', refNode.id)
      return el
    }
  }
}

function _getReferenceLabel (refNode) {
  if (refNode.state && refNode.state.label) {
    return refNode.state.label
  }
  return '?'
}
