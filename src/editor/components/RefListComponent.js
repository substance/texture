import { NodeComponent } from 'substance'
import { prefillEntity } from '../../entities/prefillEntity'
import CreateEntity from '../../entities/CreateEntity'
import EditEntity from '../../entities/EditEntity'
import ModalDialog from '../../shared/ModalDialog'
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
      'created': this._onAddNew
    })
  }

  getInitialState() {
    return {
      popup: false,
      mode: undefined,
      modeProps: undefined
    }
  }

  render($$) {
    const referenceManager = this.context.referenceManager
    const bibliography = referenceManager.getBibliography()
    const mode = this.state.mode
    const popup = this.state.popup

    let el = $$('div').addClass('sc-ref-list')
      .attr('data-id', 'ref-list')

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
      ).on('click', this._toggleNewReferencePopup)
    )

    // Render new reference popup
    if(popup) {
      options.append(
        this._renderNewReferencePopup($$)
      )
    }

    el.append(options)

    return el
  }

  _renderNewReferencePopup($$) {
    const targetTypes = [
      'journal-article', 'book', 'conference-proceeding',
      'clinical-trial', 'preprint', 'report',
      'periodical', 'data-publication', 'patent',
      'webpage', 'thesis', 'software'
    ]
    const labelProvider = this.context.labelProvider

    let el = $$('ul').addClass('se-new-reference-menu')
    targetTypes.forEach(item => {
      el.append(
        $$('li').addClass('se-type').append(
          labelProvider.getLabel(item)
        ).on('click', this._onCreate.bind(this, item))
      )
    })

    return el
  }

  _onAddNew(entityId) {
    const editorSession = this.context.editorSession
    const referenceManager = this.context.referenceManager
    editorSession.transaction(tx => {
      let refList = tx.find('ref-list')
      let entityRefNode = tx.createElement('ref')
      entityRefNode.setAttribute('rid', entityId)
      refList.appendChild(entityRefNode)
    })
    referenceManager._updateLabels()
    this.setState({
      popup: false
    })
  }

  _onRemove(entityId) {
    let editorSession = this.context.editorSession
    const referenceManager = this.context.referenceManager
    const doc = editorSession.getDocument()
    const parent = doc.find('ref-list')
    let refId = this._getRefIdForEntityId(entityId)
    removeElementAndXrefs(editorSession, refId, parent)
    referenceManager._updateLabels()
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

  _toggleNewReferencePopup() {
    const popup = this.state.popup
    this.extendState({
      popup: !popup
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
}
