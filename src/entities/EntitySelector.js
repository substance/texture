import { Component } from 'substance'
import entityRenderers from './entityRenderers'

/*
  Used to select multiple entities of allowed types.

  On confirmation emits a change event carrying the property name and
  an array of entity ids.
*/
export default class EntitySelector extends Component {
  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    return {
      entityIds: this.props.entityIds
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-entity-selector')
    let db = this.props.editorSession.getDocument()
    let optionsEl = $$('div').addClass('se-options')
    this.state.entityIds.forEach((entityId) => {
      let node = db.get(entityId)
      optionsEl.append(
        entityRenderers[node.type](node)
      )
    })
    el.append(optionsEl)
    el.append(this._renderSelector($$))
    el.append(
      $$('button').append('Save').on('click', this._save),
      $$('button').append('Cancel').on('click', this._cancel)
    )
    return el
  }

  /*
    TODO: we should provide auto complete functionality. Unfortunately we can't
    use datalist element, unless the text strings are unambiguous.
  */
  _renderSelector($$) {
    let db = this.props.editorSession.getDocument()
    // TODO: allow multiple target types
    let availableEntities = db.find({
      type: this.props.targetTypes[0]
    })
    let el = $$('div').addClass('se-selector')
    let selectEl = $$('select')
      .ref('selector')
    availableEntities.forEach((entity) => {
      // Only show entities that are not already referenced
      if (this.state.entityIds.indexOf(entity.id) < 0) {
        selectEl.append(
          $$('option').attr({ value: entity.id }).append(
            entityRenderers[entity.type](entity)
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
    Add new entity.

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
    this.send('entitiesSelected', this.props.property, this.state.entityIds)
  }

  _cancel() {
    this.send('cancel')
  }
}
