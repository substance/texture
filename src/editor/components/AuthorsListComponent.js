import { NodeComponent } from 'substance'
import entityRenderers from '../../entities/entityRenderers'
import ModalDialog from '../../shared/ModalDialog'
import EditRelationship from '../../entities/EditRelationship'

export default class AuthorsListComponent extends NodeComponent {

  didMount() {
    super.didMount()
    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing,
      'entitiesSelected': this._updateAuthors
    })
  }

  getInitialState() {
    return {
      edit: false
    }
  }

  _getEntityIds() {
    return this.props.node.findAll('contrib').map(contrib => contrib.id)
  }

  render($$) {
    let el = $$('div').addClass('sc-authors-list')
    let contribs = this.props.node.findAll('contrib')
    let db = this.context.entityDb

    if (this.state.edit) {
      var modal = $$(ModalDialog, {
        width: 'medium',
        textAlign: 'center'
      })
      modal.append(
        $$(EditRelationship, {
          propertyName: 'authors',
          entityIds: this._getEntityIds(),
          targetTypes: ['person', 'organisation']
        })
      )
      el.append(modal)
    }

    let contentEl = $$('div').addClass('se-content')
    contribs.forEach(contrib => {
      let entity = db.get(contrib.id)
      contentEl.append(
        $$('div').addClass('se-author').html(
          entityRenderers[entity.type](entity.id, db)
        )
      )
    })

    el.append(contentEl)
    el.append(
      $$('button').append('Edit Authors').on('click', this._editAuthors)
    )
    return el
  }

  _editAuthors() {
    this.setState({
      edit: true
    })
  }

  _doneEditing() {
    this.setState({
      edit: false
    })
  }

  _updateAuthors(/*entityIds*/) {
    console.warn('TODO: update authors')
    // this.setState({
    //   edit: false
    // })
  }

}
