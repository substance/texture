import { Component } from 'substance'

import EntityForm from './EntityForm'

export default class EditEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-edit-entity')

    el.append(
      $$(EntityForm, {
        node: this.props.node
      }).ref('form')
    )

    el.append(
      $$('button').append('Save').on('click', this._onSave),
      $$('button').append('Cancel').on('click', this._cancel)
    )
    return el
  }

  _onSave() {
    let dbSession = this.context.dbSession
    let newProps = this.refs.form.getData()
    dbSession.transaction((tx) => {
      tx.updateNode(this.props.node.id, newProps)
    })
    this.send('done')
  }

  _cancel() {
    this.send('closeModal')
  }

}
