import { NodeComponent, without } from 'substance'
import ModalDialog from '../../shared/ModalDialog'
import CreateEntity from '../../entities/CreateEntity'
import EditEntity from '../../entities/EditEntity'
import RefComponent from './RefComponent'

export default class RefListComponent extends NodeComponent {

  didMount() {
    super.didMount()

    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing,
      'editReference': this._onEdit,
      'removeReference': this._onRemove
    })
  }

  getInitialState() {
    return {
      //edit: false,
      mode: undefined,
      modeProps: undefined
    }
  }

  render($$) {
    const referenceManager = this.context.referenceManager
    let el = $$('div').addClass('sc-ref-list')
    let bibliography = referenceManager.getBibliography()
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
          width: 'medium',
          textAlign: 'center',
          transparent: true
        }).append(
          $$(ModeComponent, this.state.modeProps)
        )
      )
    }

    el.append(
      $$('div').addClass('se-title').append(
        'References'
      )
    )
    bibliography.forEach((reference) => {
      el.append($$(RefComponent, { node: reference }))
    })
    if(bibliography.length === 0) {
      el.append(
        $$('div').addClass('se-empty-list').append(
          this.getLabel('no-references')
        )
      )
    }
    el.append(
      $$('button').addClass('sc-button sm-style-big').append('Add Reference')
        .on('click', this._toggleNewReferencePopup)
    )
    return el
  }

  _renderNewReferencePopup() {
    //      targetTypes: [
    //         'journal-article', 'book', 'conference-proceeding',
    //         'clinical-trial', 'preprint', 'report',
    //         'periodical', 'data-publication', 'patent',
    //         'webpage', 'thesis', 'software'
    //       ]
  }

  _toggleNewReferencePopup() {
    this.extendState({
      mode: 'create'
    })
  }

  _doneEditing() {
    this.extendState({
      mode: undefined
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

  _onRemove(entityId) {
    const referenceManager = this.context.referenceManager
    let bibliography = referenceManager.getBibliography()
    let entityIdsList = bibliography.map((e) => {
      if (!e.state.entity) {
        console.error('FIXME: no entity for bib item', e.id)
        return undefined
      } else {
        return e.state.entity.id
      }
    })
    let entityIds = without(entityIdsList, entityId)
    referenceManager.updateReferences(entityIds)
  }
}
