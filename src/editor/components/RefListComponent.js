import { NodeComponent } from 'substance'
import { prefillEntity } from '../../entities/prefillEntity'
import ModalDialog from '../../shared/ModalDialog'
import AddReferenceComponent from './AddReferenceComponent'
import RefComponent from './RefComponent'
import Button from './Button'
import removeElementAndXrefs from '../../util/removeElementAndXrefs'

export default class RefListComponent extends NodeComponent {

  didMount() {
    super.didMount()

    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing,
      'add': this._onCreate,
      'created': this._onAddNew,
      'importBib': this._onImport
    })
  }

  getInitialState() {
    let bibliography = this._getBibliography()

    let state = {
      mode: undefined,
      modeProps: undefined
    }

    if (bibliography.length === 0) {
      state.hidden = true
    }
    return state
  }

  render($$) {
    const bibliography = this._getBibliography()
    const mode = this.state.mode

    let el = $$('div').addClass('sc-ref-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    if (mode) {
      let ModeComponent
      if(mode === 'add') {
        ModeComponent = AddReferenceComponent
      } else if (mode === 'edit') {
        ModeComponent = this.getComponent('edit-entity')
      } else {
        ModeComponent = this.getComponent('create-entity')
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

    if (bibliography.length > 0) {
      el.append(
        $$('div').addClass('se-title').append(
          this.getLabel('references')
        )
      )
    }


    bibliography.forEach(reference => {
      const entityId = reference.getAttribute('rid')
      el.append(
        $$('div').addClass('se-ref-item').append(
          $$(RefComponent, { node: reference }),
          $$('div').addClass('se-ref-actions').append(
            $$(Button, {icon: 'pencil', tooltip: this.getLabel('edit-ref')})
              .on('click', this._onEdit.bind(this, entityId)),
            $$(Button, {icon: 'trash', tooltip: this.getLabel('remove-ref')})
              .on('click', this._onRemove.bind(this, entityId))
          )
        )
      )
    })

    let options = $$('div').addClass('se-ref-list-options').append(
      $$('button').addClass('sc-button sm-style-big').append(
        this.getLabel('add-ref')
      ).on('click', this._toggleNewReferenceModal)
    )

    el.append(options)

    return el
  }

  _onAddNew(entityId) {
    const editorSession = this.context.editorSession
    editorSession.transaction(tx => {
      let refList = tx.find('ref-list')
      let entityRefNode = tx.createElement('ref')
      entityRefNode.setAttribute('rid', entityId)
      refList.appendChild(entityRefNode)
    })

    this.setState({})
  }

  _onRemove(entityId) {
    let editorSession = this.context.editorSession
    const doc = editorSession.getDocument()
    const parent = doc.find('ref-list')
    let refId = this._getRefIdForEntityId(entityId)
    removeElementAndXrefs(editorSession, refId, parent)
  }

  _onCreate(targetType) {
    let defaults = {}
    defaults = prefillEntity(targetType, '')
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

  _onImport(items) {
    let db = this.context.pubMetaDbSession.getDocument()
    const editorSession = this.context.editorSession
    editorSession.transaction(tx => {
      items.forEach(item => {
        const existedRef = this._getRefIdForDOI(item.doi)
        if(!existedRef) {
          let node = db.create(item)
          let entityId = node.id
          let refList = tx.find('ref-list')
          let entityRefNode = tx.createElement('ref')
          entityRefNode.setAttribute('rid', entityId)
          refList.appendChild(entityRefNode)
        }
      })
    })
    this.setState({})
  }

  _toggleNewReferenceModal() {
    this.extendState({
      mode: 'add',
      modeProps: {}
    })
  }

  _doneEditing() {
    this.setState({
      mode: undefined
    })
  }

  _getRefIdForEntityId(entityId) {
    const editorSession = this.context.editorSession
    const doc = editorSession.getDocument()
    let refNode = doc.find(`ref-list > ref[rid=${entityId}]`)
    if (refNode) return refNode.id
  }

  _getRefIdForDOI(doi) {
    const bibliography = this._getBibliography()
    const node = bibliography.find(bib => {
      const entity = bib.state.entity
      if(!entity || !entity.doi) return false
      return entity.doi.toLowerCase() === doi.toLocaleLowerCase()
    })
    return node ? node.id : false
  }

  _getBibliography() {
    const referenceManager = this.context.referenceManager
    return referenceManager.getBibliography()
  }
}
