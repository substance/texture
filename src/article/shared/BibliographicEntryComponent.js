import { NodeComponent } from '../../kit'
import { renderEntity } from './entityHelpers'

export default class BibliographicEntryComponent extends NodeComponent {
  render ($$) {
    const refNode = this.getNode()
    let label = _getReferenceLabel(refNode)
    let html = renderEntity(refNode)

    // TODO: do we want to display something like this
    // if so, use the label provider
    html = html || '<i>Not available</i>'

    return $$('div').addClass('sc-ref-component').append(
      $$('div').addClass('se-label').append(label),
      $$('div').addClass('se-text').html(html)
    ).attr('data-id', refNode.id)
  }
}

function _getReferenceLabel (refNode) {
  if (refNode.state && refNode.state.label) {
    return refNode.state.label
  }
  return '?'
}
