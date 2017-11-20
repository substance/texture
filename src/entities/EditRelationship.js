import { Component } from 'substance'
import entityRenderers from './entityRenderers'
import CreateEntity from './CreateEntity'

/*
  Used to edit relationhips to other entities.

  On confirmation emits a change event carrying the property name and
  an array of entity ids.
*/
export default class EditRelationship extends Component {
  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    return {
      create: undefined,
      entityIds: this.props.entityIds
    }
  }

  didMount() {
    this.handleActions({
      'done': this._closeModal,
      'cancel': this._closeModal
    })
  }

  _closeModal() {
    this.extendState({
      create: undefined
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-edit-relationship')
    let db = this.context.db

    if (this.state.create) {
      el.append(
        $$(CreateEntity, {
          type: this.state.create
        })
      )
    }

    let optionsEl = $$('div').addClass('se-options')
    this.state.entityIds.forEach((entityId) => {
      let node = db.get(entityId)
      optionsEl.append(
        entityRenderers[node.type]($$, node.id, db)
      )
    })
    el.append(optionsEl)
    el.append(this._renderSelector($$))

    // Render create buttons for each allowed target type
    this.props.targetTypes.forEach(targetType => {
      el.append(
        $$('button').append('Create '+targetType)
          .on('click', this._toggleCreate.bind(this, targetType))
      )
    })

    el.append(
      $$('button').append('Save').on('click', this._save),
      $$('button').append('Cancel').on('click', this._cancel)
    )
    return el
  }

  _toggleCreate(targetType) {
    this.extendState({
      create: targetType
    })
  }

  _getAvailableEntities(db) {
    let availableEntities = []
    this.props.targetTypes.forEach(targetType => {
      availableEntities = availableEntities.concat(
        db.find({ type: targetType })
      )
    })
    return availableEntities
  }

  /*
    TODO: we should provide auto complete functionality. Unfortunately we can't
    use datalist element, unless the text strings are unambiguous.
  */
  _renderSelector($$) {
    let db = this.context.db
    let availableEntities = this._getAvailableEntities(db)
    let el = $$('div').addClass('se-selector')
    let selectEl = $$('select')
      .ref('selector')
    availableEntities.forEach((entity) => {
      // Only show entities that are not already referenced
      if (this.state.entityIds.indexOf(entity.id) < 0) {
        selectEl.append(
          $$('option').attr({ value: entity.id }).append(
            entityRenderers[entity.type]($$, entity.id, db)
          )
        )
      }
    })
    el.append(
      selectEl,
      $$('button').append('Add selected').on('click', this._onEntitySelected)
    )
    return el
  }

  /*
    Add new entity target.

    NOTE: Not saved until confirmed.
  */
  _onEntitySelected() {
    let entityId = this.refs.selector.val()
    let entityIds = this.state.entityIds.concat([ entityId ])
    this.extendState({
      entityIds: entityIds
    })
  }

  _save() {
    this.send('entitiesSelected', this.state.entityIds)
  }

  _cancel() {
    this.send('cancel')
  }
}
