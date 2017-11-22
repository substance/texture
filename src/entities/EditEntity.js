import { Component } from 'substance'
import EntityForm from './EntityForm'
import FormTitle from './FormTitle'

export default class EditEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-edit-entity')

    el.append(
      $$('div').addClass('se-content').append(
        $$(FormTitle, {
          name: 'edit-'+this.props.node.type
        }),
        $$(EntityForm, {
          node: this.props.node
        }).ref('form')
      ),
      $$('div').addClass('sg-actions').append(
        $$('button')
          .addClass('sm-primary')
          .append('Save')
          .on('click', this._save),
        $$('button')
          .append('Cancel')
          .on('click', this._cancel)
      )
    )
    return el
  }

  _save() {
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
