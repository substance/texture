import { Component, Modal } from 'substance'
import EntityEditor from '../../entities/EntityEditor'
import entityRenderers from '../../entities/entityRenderers'

export default class Bibliography extends Component {

  getInitialState() {
    return {
      entityId: undefined
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-bibliography')
    let editorSession = this.context.editorSession
    let entityDb = this.context.editorSession.getDocument()

    if (this.state.editEntity) {
      var modal = $$(Modal, {
        width: 'medium',
        textAlign: 'center'
      })

      modal.append(
        $$(EntityEditor, {
          editorSession: editorSession,
          node: entityDb.get(this.state.entityId)
        })
      )
    }

    this.context.referenceManager.getBibliography().forEach((reference) => {
      let fragments = entityRenderers[reference.type]($$, reference.id, entityDb)
      el.append(
        $$('div').addClass('se-reference').append(
          $$('div').addClass('se-text').append(
            ...fragments
          ),
          $$('div').addClass('se-actions').append(
            $$('button').append('Edit').on('click', this._toggleEditor.bind(this, reference.id)),
            $$('button').append('Delete')
          )
        )
      )
    })
    return el
  }

  _toggleEditor(referenceId) {
    console.log('TODO: open editor for ', referenceId)
  }
}
