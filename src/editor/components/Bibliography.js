import { Component } from 'substance'
// import EditEntity from '../../entities/EditEntity'
import EditRelationship from '../../entities/EditRelationship'
import entityRenderers from '../../entities/entityRenderers'
import ModalDialog from '../../shared/ModalDialog'

export default class Bibliography extends Component {
  didMount() {
    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing,
      'entitiesSelected': this._updateReferences
    })
  }

  getInitialState() {
    return {
      edit: false
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-bibliography')
    let db = this.context.db
    let articleNode = this.context.referenceManager.getNode()

    if (this.state.edit) {
      var modal = $$(ModalDialog, {
        width: 'medium',
        textAlign: 'center'
      })
      modal.append(
        $$(EditRelationship, {
          propertyName: 'references',
          entityIds: articleNode.references,
          targetTypes: ['journal-article', 'book']
        })
      )
      el.append(modal)
    }

    el.append(
      $$('div').addClass('se-title').append(
        'References'
      )
    )

    this.context.referenceManager.getBibliography().forEach((reference) => {
      el.append(
        $$('div').addClass('se-reference').append(
          $$('div').addClass('se-text').html(
            entityRenderers[reference.type](reference.id, db)
          )
        )
      )
    })

    el.append(
      $$('button').append('Edit').on('click', this._editBibliography)
    )
    return el
  }

  _editBibliography() {
    this.setState({
      edit: true
    })
  }

  _doneEditing() {
    this.setState({
      edit: false
    })
  }

  _updateReferences(entityIds) {
    this.context.referenceManager.updateReferences(entityIds)
    this.setState({
      edit: false
    })
  }
}
