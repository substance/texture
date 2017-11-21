import { Component } from 'substance'

import EntityForm from './EntityForm'
import ModalLayout from '../shared/ModalLayout'

export default class CreateEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-create-entity')

    el.append(
      $$(ModalLayout).append(
        $$(EntityForm, {
          node: {
            type: this.props.type
          }
        }).ref('form'),
        $$('div').addClass('sg-actions').append(
          $$('button')
            .addClass('sm-primary')
            .append('Save')
            .on('click', this._create),
          $$('button')
            .append('Cancel')
            .on('click', this._cancel)
        )
      )
    )
    return el
  }

  _create() {
    let newNode = Object.assign({}, this.refs.form.getData(), {
      type: this.props.type
    })
    let dbSession = this.context.dbSession
    dbSession.transaction((tx) => {
      tx.create(newNode)
    })
    this.send('closeModal')
  }

  _cancel() {
    this.send('closeModal')
  }

}
