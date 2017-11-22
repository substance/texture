import { Component } from 'substance'
import EditEntity from '../../entities/EditEntity'
import entityRenderers from '../../entities/entityRenderers'
import ModalDialog from '../../shared/ModalDialog'

export default class Bibliography extends Component {
  didMount() {
    this.handleActions({
      'done': this._doneEditing,
      'cancel': this._doneEditing,
      'closeModal': this._doneEditing
    })
  }

  getInitialState() {
    return {
      entityId: undefined
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-bibliography')
    let db = this.context.db

    if (this.state.entityId) {
      var modal = $$(ModalDialog, {
        width: 'medium',
        textAlign: 'center'
      })
      modal.append(
        $$(EditEntity, {
          node: db.get(this.state.entityId)
        })
      )
      el.append(modal)
    }

    el.append(
      $$('div').addClass('se-title').append(
        'Bibliography'
      )
    )

    this.context.referenceManager.getBibliography().forEach((reference) => {
      let fragments = entityRenderers[reference.type]($$, reference.id, db)
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

  _toggleEditor(entityId) {
    this.setState({
      entityId
    })
  }

  _doneEditing() {
    this.setState({
      entityId: undefined
    })
  }
}
