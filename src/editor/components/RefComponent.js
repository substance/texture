import { NodeComponent } from 'substance'
import entityRenderers from '../../entities/entityRenderers'


export default class RefComponent extends NodeComponent {

  render($$) {
    const db = this.context.db
    const reference = this.props.node
    const entityRenderer = entityRenderers[_getRefType(reference)]
    // TODO: change css class to sc-ref-component
    return $$('div').addClass('se-reference').append(
      $$('span').addClass('se-label').append(
        _getReferenceLabel(reference),
        ' '
      ),
      $$('span').addClass('se-text').html(
        entityRenderer ? entityRenderer(reference.id, db) : ''
      )
    )
  }
}

function _getReferenceLabel(ref) {
  if (ref.state && ref.state.label) {
    return ref.state.label
  }
  return ''
}

function _getRefType(ref, db) {
  if (ref.state && ref.state.entity) {
    return ref.state.entity.type
  }
  let entity = db.get(ref.id)
  if (entity) {
    return entity.type
  }
  return ''
}