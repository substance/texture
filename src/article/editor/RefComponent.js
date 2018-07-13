import { NodeComponent } from 'substance'
import { renderEntity } from '../shared/entityHelpers'

export default class RefComponent extends NodeComponent {

  render($$) {
    const db = this.context.pubMetaDbSession.getDocument()
    const ref = this.props.node
    let label = _getReferenceLabel(ref)
    let entityHtml = renderEntity(_getEntity(ref, db))

    // TODO: do we want to display something like this
    // if so, use the label provider
    entityHtml = entityHtml || '<i>Not available</i>'

    return $$('div').addClass('sc-ref-component').append(
      $$('div').addClass('se-label').append(label),
      $$('div').addClass('se-text').html(entityHtml)
    ).attr('data-id', ref.id)
  }
}

function _getReferenceLabel(ref) {
  if (ref.state && ref.state.label) {
    return ref.state.label
  }
  return '?'
}

function _getEntity(ref, db) {
  if (ref.state && ref.state.entity) {
    return ref.state.entity
  }
  return db.get(ref.id)
}
