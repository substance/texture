import { Component, isNil, without, FontAwesomeIcon as Icon } from 'substance'
import { prefillEntity } from './prefillEntity'
import entityRenderers from './entityRenderers'
import ModalDialog from '../shared/ModalDialog'
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
    let db = this.context.pubMetaDbSession.getDocument()
    let mode = this.state.mode

    if (mode) {
      let ModeComponent
      if (mode === 'edit') {
        ModeComponent = this.getComponent('edit-entity')
      } else {
        ModeComponent = this.getComponent('create-entity')
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
        $$(this.getComponent('form-title'), {
          name: 'edit-'+this.props.propertyName
        })
      )
      if (this.state.entityIds.length > 0) {
        let tableEl = $$('table').addClass('se-entries')
        this.state.entityIds.forEach((entityId) => {
          let node = db.get(entityId)
          tableEl.append(
            $$('tr').addClass('se-entry').append(
              $$('td').addClass('se-handle').append(
                $$(Icon, {icon: 'fa-reorder'}).addClass('se-icon')
              )
              .on('mousedown', this._activateRowDrag.bind(this, entityId)),
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
            ).ref(entityId)
            .on('dragend', this._onDragend.bind(this, entityId))
            .on('dragover', this._onDragOver.bind(this, entityId))
            .on('dragleave', this._onDragLeave.bind(this, entityId))
            .on('dragstart', this._onDrag)
            .on('dragenter', this._onDrag)
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
            .addClass('sc-button sm-style-big')
            .append('Update')
            .on('click', this._save),
          $$('button')
            .addClass('sc-button sm-style-big sm-secondary')
            .append('Cancel')
            .on('click', this._cancel)
        )
      )
    }
    return el
  }

  _onCreate(targetType, text) {
    let defaults = {}
    if (!isNil(text)) {
      defaults = prefillEntity(targetType, text)
    }
    this.extendState({
      mode: 'create',
      modeProps: {
        type: targetType,
        defaults: defaults
      }
    })
  }

  _onEdit(entityId) {
    let db = this.context.pubMetaDbSession.getDocument()
    let node = db.get(entityId)
    this.extendState({
      mode: 'edit',
      modeProps: {
        node
      }
    })
  }

  _onReorder(entityId, target) {
    let entityIds = this.state.entityIds
    const currentPos = entityIds.indexOf(entityId)
    const targetPos = entityIds.indexOf(target)
    entityIds[currentPos] = target
    entityIds[targetPos] = entityId
    this.extendState({entityIds: entityIds})
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

  _activateRowDrag(entityId) {
    let rowEl = this.refs[entityId]
    rowEl.attr('draggable', true)
  }

  _deactivateRowDrag(entityId) {
    let rowEl = this.refs[entityId]
    rowEl.attr('draggable', false)
  }

  _onDragend(entityId) {
    this._deactivateRowDrag(entityId)
    this._onReorder(entityId, this.currentTarget)
    this.currentTarget = null
    this.currentVisualTarget = null
  }

  _onDragOver(entityId) {
    if(this.currentVisualTarget !== entityId) {
      this.currentTarget = entityId
      this.currentVisualTarget = entityId
      let rowEl = this.refs[entityId]
      rowEl.addClass('sm-drop')
    }
  }

  _onDragLeave(entityId) {
    this.currentVisualTarget = null
    let rowEl = this.refs[entityId]
    rowEl.removeClass('sm-drop')
  }

  _onDrag(e) {
    // Stop event propagation for the dragstart and dragenter
    // events, to avoid editor drag manager errors
    e.stopPropagation()
  }
}
