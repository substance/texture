import { NodeComponent } from 'substance'
import { renderEntity } from '../../entities/entityHelpers'

export default class RefComponent extends NodeComponent {

  render($$) {
    const db = this.context.db
    const ref = this.props.node
    let label = _getReferenceLabel(ref)
    let entityHtml = renderEntity(_getEntity(ref, db))

    // TODO: do we want to display something like this
    // if so, use the label provider
    entityHtml = entityHtml || '<i>Not available</i>'

    // TODO: change css class to sc-ref-component
    return $$('div').addClass('se-reference').append(
      $$('span').addClass('se-label').append( label),
      ' ',
      $$('span').addClass('se-text').html(entityHtml)
    )
  }
}

function _getReferenceLabel(ref) {
  if (ref.state && ref.state.label) {
    return ref.state.label
  }
  return ''
}

function _getEntity(ref, db) {
  if (ref.state && ref.state.entity) {
    return ref.state.entity
  }
  return db.get(ref.id)
}