import { Component } from 'substance'
import EditRelationship from './EditRelationship'
import entityRenderers from './entityRenderers'
import ModalDialog from '../shared/ModalDialog'

/*
  Input that manages a list of entityIds, as needed for a multi-target
  relationship between entities
*/
export default class RelationshipInput extends Component {

  getInitialState() {
    return {
      entityIds: this.props.entityIds,
      edit: false
    }
  }

  didMount() {
    this.handleActions({
      'cancel': this._onCancel,
      'entitiesSelected': this._onEntitiesSelected,
      'closeModal': this._onCancel,
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-relationship-input')
    let entities = this.state.entityIds
    let db = this.context.pubMetaDbSession.getDocument()

    if (this.state.edit) {
      el.append(
        $$(ModalDialog, {
          transparent: true
        }).append(
          $$(EditRelationship, {
            propertyName: this.props.propertyName,
            entityIds: this.state.entityIds,
            targetTypes: this.props.targetTypes
          })
        )
      )
    }
    if (entities.length > 0) {
      entities.forEach((entityId, index) => {
        let entity = db.get(entityId)
        el.append(
          $$('span').html(
            entityRenderers[entity.type](entity.id, db)
          )
        )
        if (index < entities.length-1) {
          el.append(', ')
        }
      })
    } else {
      el.append(
        $$('div').addClass('se-empty').append('No Entries')
      )
    }

    el.append(
      $$('button').append('Edit').on('click', this._openRelationshipEditor)
    )

    return el
  }

  _onEntitiesSelected(entityIds) {
    this.setState({
      entityIds,
      edit: false
    })
  }

  _onCancel() {
    this.extendState({
      edit: false
    })
  }

  _openRelationshipEditor() {
    this.extendState({
      edit: true
    })
  }

  getValue() {
    return this.state.entityIds
  }

}
