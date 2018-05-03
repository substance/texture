import { Component } from 'substance'

export default class EditEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-edit-entity')

    el.append(
      $$('div').addClass('se-content').append(
        $$(this.getComponent('form-title'), {
          name: 'edit-'+this.props.node.type
        }),
        $$(this.getComponent('entity-form'), {
          node: this.props.node
        }).ref('form')
      ),
      $$('div').addClass('sg-actions').append(
        $$('button')
          .addClass('sc-button sm-style-big')
          .append('Update')
          .on('click', this._save),
        $$('button')
          .addClass('sc-button sm-style-big sm-secondary')
          .append('Cancel')
          .on('click', this._cancel)
      )
    )
    return el
  }

  _save() {
    let pubMetaDbSession = this.context.pubMetaDbSession
    let newProps = this.refs.form.getData()
    pubMetaDbSession.transaction((tx) => {
      tx.updateNode(this.props.node.id, newProps)
    })
    this.send('closeModal')
  }

  _cancel() {
    this.send('closeModal')
  }

}
