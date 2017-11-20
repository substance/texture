import { Component } from 'substance'

import EntityForm from './EntityForm'

export default class CreateEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-create-entity')
    el.append(
      $$(EntityForm, {
        node: {
          type: this.props.type
        }
      }).ref('form')
    )
    el.append(
      $$('button').append('Create').on('click', this._onCreate),
      $$('button').append('Cancel').on('click', this._cancel)
    )
    return el
  }

  _onCreate() {
    let newNode = Object.assign({}, this.refs.form.getData(), {
      type: this.props.type
    })
    let dbSession = this.context.dbSession
    dbSession.transaction((tx) => {
      tx.create(newNode)
    })
    this.send('done')
  }

  _cancel() {
    this.send('cancel')
  }

}
