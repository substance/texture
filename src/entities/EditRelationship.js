import { Component } from 'substance'
import entityRenderers from './entityRenderers'
import CreateEntity from './CreateEntity'
import ModalDialog from '../shared/ModalDialog'
import ModalLayout from '../shared/ModalLayout'
import EntitySelector from './EntitySelector'

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
      entityIds: this.props.entityIds || []
    }
  }

  didMount() {
    this.handleActions({
      'closeModal': this._closeModal
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-edit-relationship')
    let db = this.context.db

    if (this.state.create) {
      el.append(
        $$(ModalDialog, {
          transparent: true
        }).append(
          $$(CreateEntity, {
            type: this.state.create
          })
        )
      )
    } else {
      let contentEl = $$('div').addClass('se-edit-relationship-content')

      if (this.state.entityIds.length > 0) {
        let optionsEl = $$('div').addClass('se-options')
        this.state.entityIds.forEach((entityId) => {
          let node = db.get(entityId)
          optionsEl.append(
            $$('div').addClass('se-option').append(
              entityRenderers[node.type]($$, node.id, db)
            )
          )
        })
        contentEl.append(optionsEl)
      } else {
        contentEl.append(
          $$('div').addClass('se-empty').append('No Entries')
        )
      }

      contentEl.append(
        $$(EntitySelector, {
          placeholder: 'Select a person or organisation',
          targetTypes: this.props.targetTypes,
          showCreateDialog: true,
          limit: 50
        })
        // .on('selected', this._onSelected)
        // .on('create', this._onCreate)
      )

      // Render create buttons for each allowed target type
      this.props.targetTypes.forEach(targetType => {
        contentEl.append(
          $$('button').append('Create '+targetType)
            .on('click', this._toggleCreate.bind(this, targetType))
        )
      })

      el.append(
        $$(ModalLayout).append(
          contentEl,
          $$('div').addClass('sg-actions').append(
            $$('button')
              .addClass('sm-primary')
              .append('Save')
              .on('click', this._save),
            $$('button')
              .append('Cancel')
              .on('click', this._cancel)
          )
        )
      )
    }

    return el
  }

  _toggleCreate(targetType) {
    this.extendState({
      create: targetType
    })
  }

  _save() {
    this.send('entitiesSelected', this.state.entityIds)
  }

  _cancel() {
    this.send('closeModal')
  }

  _closeModal() {
    this.extendState({
      create: undefined
    })
  }
}
