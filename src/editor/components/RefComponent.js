import { NodeComponent } from 'substance'
import { renderEntity } from '../../entities/entityHelpers'
import Button from './Button'

export default class RefComponent extends NodeComponent {

  render($$) {
    const db = this.context.pubMetaDbSession.getDocument()
    const ref = this.props.node
    const entityId = ref.getAttribute('rid')
    let label = _getReferenceLabel(ref)
    let entityHtml = renderEntity(_getEntity(ref, db))

    // TODO: do we want to display something like this
    // if so, use the label provider
    entityHtml = entityHtml || '<i>Not available</i>'

    let el = $$('div').addClass('sc-ref-component').append(
      $$('div').addClass('se-label').append(label),
      $$('div').addClass('se-text').html(entityHtml)
    )

    if(this.props.mode === 'back') {
      el.append(
        $$('div').addClass('se-actions').append(
          $$(Button, {icon: 'pencil', tooltip: 'Edit'})
            .on('click', this._onEdit.bind(this, entityId)),
          $$(Button, {icon: 'trash', tooltip: 'Remove'})
            .on('click', this._onRemove.bind(this, entityId))
        )
      )
    }

    return el
  }

  _onEdit(entityId) {
    this.send('editReference', entityId)
  }

  _onRemove(entityId) {
    this.send('removeReference', entityId)
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
