import { NodeComponent } from '../../kit'
import { renderEntity } from './entityHelpers'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class ReferenceComponent extends NodeComponent {
  render ($$) {
    const refNode = this.getNode()
    let el = $$('div').addClass('sc-reference')
    let label = _getReferenceLabel(refNode)
    let html = renderEntity(refNode)
    // TODO: do we want to display something like this
    // if so, use the label provider
    html = html || '<i>Not available</i>'
    if (this.props.mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: this.props.model.id,
          selected: this.props.selected,
          label: label,
          description: $$('div').html(html)
        })
      )
    } else {
      el.append(
        $$('div').addClass('se-label').append(label),
        $$('div').addClass('se-text').html(html)
      ).attr('data-id', refNode.id)
    }
    return el
  }
}

function _getReferenceLabel (refNode) {
  if (refNode.state && refNode.state.label) {
    return refNode.state.label
  }
  return '?'
}
