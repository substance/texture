import { Component, without } from 'substance'
import entityRenderers from './entityRenderers'
import CreateEntity from './CreateEntity'
import EditEntity from './EditEntity'
import ModalDialog from '../shared/ModalDialog'
import EntitySelector from './EntitySelector'
import FormTitle from './FormTitle'

/*
  Used to edit relationhips to other entities.

  On confirmation emits a change event carrying the property name and
  an array of entity ids.
*/
export default class EditRelationship extends Component {
  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    return {
      mode: undefined,
      modeProps: undefined,
      entityIds: this.props.entityIds || []
    }
  }

  didMount() {
    this.handleActions({
      'closeModal': this._closeModal,
      'created': this._onAddNew
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-edit-relationship')
    let db = this.context.db
    let mode = this.state.mode

    if (mode) {
      let ModeComponent
      if (mode === 'edit') {
        ModeComponent = EditEntity
      } else {
        ModeComponent = CreateEntity
      }

      el.append(
        $$(ModalDialog, {
          transparent: true
        }).append(
          $$(ModeComponent, this.state.modeProps)
        )
      )
    } else {
      let contentEl = $$('div').addClass('se-content')

      contentEl.append(
        $$(FormTitle, {
          name: 'edit-'+this.props.propertyName
        })
      )

      if (this.state.entityIds.length > 0) {
        let tableEl = $$('table').addClass('se-entries')
        this.state.entityIds.forEach((entityId) => {
          let node = db.get(entityId)
          tableEl.append(
            $$('tr').addClass('se-entry').append(
              $$('td').addClass('se-name').html(
                entityRenderers[node.type](node.id, db)
              ),
              $$('td').addClass('se-type').append(
                $$('span').append(this.context.labelProvider.getLabel(node.type))
              ),
              $$('td').addClass('se-actions').append(
                $$('button').append('Edit').on('click', this._onEdit.bind(this, entityId)),
                $$('button').append('Delete').on('click', this._onDelete.bind(this, entityId))
              )
            )
          )
        })
        contentEl.append(tableEl)
      } else {
        contentEl.append(
          $$('div').addClass('se-empty').append('No Entries')
        )
      }

      contentEl.append(
        $$(EntitySelector, {
          placeholder: 'Type to add new ...',
          targetTypes: this.props.targetTypes,
          showCreateDialog: true,
          excludes: this.state.entityIds,
          limit: 50,
          onSelected: this._onAddNew.bind(this),
          onCreate: this._onCreate.bind(this),
        })
      )

      el.append(
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
    }
    return el
  }

  _onCreate(targetType) {
    this.extendState({
      mode: 'create',
      modeProps: {
        type: targetType
      }
    })
  }

  _onEdit(entityId) {
    let db = this.context.db
    let node = db.get(entityId)
    this.extendState({
      mode: 'edit',
      modeProps: {
        node
      }
    })
  }

  _onAddNew(entityId) {
    let entityIds = this.state.entityIds.concat([ entityId ])
    this.extendState({
      entityIds: entityIds,
      mode: undefined,
      modeProps: undefined
    })
  }

  _onDelete(entityId) {
    let entityIds = without(this.state.entityIds, entityId)
    this.extendState({
      entityIds: entityIds
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
      mode: undefined,
      modeProps: undefined
    })
  }
}
