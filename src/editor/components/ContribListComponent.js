import { NodeComponent } from 'substance'
import entityRenderers from '../../entities/entityRenderers'
import ModalDialog from '../../shared/ModalDialog'
import EditRelationship from '../../entities/EditRelationship'
import updateEntityChildArray from '../../util/updateEntityChildArray'


export default class ContribsListComponent extends NodeComponent {

  didMount() {
    super.didMount()
    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing,
      'entitiesSelected': this._updateContribs
    })
  }

  getInitialState() {
    return {
      edit: false
    }
  }

  _getEntityIds() {
    return this.props.node.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
  }

  render($$) {
    let el = $$('div').addClass(this.getClassNames())
    let entityIds = this._getEntityIds()
    let db = this.context.entityDb

    if (this.state.edit) {
      var modal = $$(ModalDialog, {
        width: 'medium',
        textAlign: 'center'
      })
      modal.append(
        $$(EditRelationship, {
          propertyName: this.getPropertyName(),
          entityIds: this._getEntityIds(),
          targetTypes: this.getTargetTypes()
        })
      )
      el.append(modal)
    }

    let contentEl = $$('div').addClass('se-content')
    entityIds.forEach((entityId, index) => {
      let entity = db.get(entityId)
      contentEl.append(
        $$('span').addClass('se-contrib').html(
          entityRenderers[entity.type](entity.id, db)
        )
      )
      if (index < entityIds.length - 1) {
        contentEl.append(', ')
      }
    })

    el.append(contentEl)
    el.append(
      $$('button').addClass('sc-button sm-style-big').append('Edit ', this.getPropertyName()).on('click', this._editContribs)
    )
    return el
  }

  _editContribs() {
    this.setState({
      edit: true
    })
  }

  _doneEditing() {
    this.setState({
      edit: false
    })
  }

  _updateContribs(entityIds) {
    let oldEntityIds = this._getEntityIds()
    updateEntityChildArray(this.context.editorSession, this.props.node.id, 'contrib', 'rid', oldEntityIds, entityIds)
    this.setState({
      edit: false
    })
  }

}
