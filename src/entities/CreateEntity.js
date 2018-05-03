import { Component } from 'substance'

export default class CreateEntity extends Component {

  render($$) {
    let el = $$('div').addClass('sc-create-entity')
    el.append(
      $$('div').addClass('se-content').append(
        $$(this.getComponent('form-title'), {
          name: 'create-'+this.props.type
        }),
        $$(this.getComponent('entity-form'), {
          node: this.props.defaults
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
    let pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    this.send('created', node.id)
  }

  _cancel() {
    this.send('closeModal')
  }

}
