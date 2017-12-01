import { Component } from 'substance'
import EntityForm from './EntityForm'
import FormTitle from './FormTitle'

export default class CreateEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-create-entity')
    el.append(
      $$('div').addClass('se-content').append(
        $$(FormTitle, {
          name: 'create-'+this.props.type
        }),
        $$(EntityForm, {
          node: {
            type: this.props.type
          }
        }).ref('form')
      ),
      $$('div').addClass('sg-actions').append(
        $$('button')
          .addClass('sc-button sm-style-big')
          .append('Create')
          .on('click', this._create),
        $$('button')
          .addClass('sc-button sm-style-big sm-secondary')
          .append('Cancel')
          .on('click', this._cancel)
      )
    )
    return el
  }

  _create() {
    let newNode = Object.assign({}, this.refs.form.getData(), {
      type: this.props.type
    })
    let dbSession = this.context.dbSession
    let node
    dbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    this.send('created', node.id)
  }

  _cancel() {
    this.send('closeModal')
  }

}
