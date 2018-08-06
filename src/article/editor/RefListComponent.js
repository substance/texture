import NodeComponent from '../shared/NodeComponent'
import RefComponent from './RefComponent'
import Button from './Button'

export default class RefListComponent extends NodeComponent {

  getInitialState() {
    let bibliography = this._getBibliography()

    let state = {
    }

    if (bibliography.length === 0) {
      state.hidden = true
    }
    return state
  }

  render($$) {
    const bibliography = this._getBibliography()

    let el = $$('div').addClass('sc-ref-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    if (bibliography.length > 0) {
      el.append(
        $$('div').addClass('se-title').append(
          this.getLabel('references')
        )
      )
    }

    bibliography.forEach(reference => {
      el.append(
        $$('div').addClass('se-ref-item').append(
          $$(RefComponent, { node: reference }),
          $$('div').addClass('se-ref-actions').append(
            $$(Button, {icon: 'pencil', tooltip: this.getLabel('edit-ref')})
              .on('click', this._editReference.bind(this, reference)),
            $$(Button, {icon: 'trash', tooltip: this.getLabel('remove-ref')})
              .on('click', this._removeReference.bind(this, reference))
          )
        )
      )
    })

    let options = $$('div').addClass('se-ref-list-options').append(
      $$('button').addClass('sc-button sm-style-big').append(
        this.getLabel('add-ref')
      ).on('click', this._addNewReference)
    )

    el.append(options)

    return el
  }

  _addNewReference() {
    this.send('startWorkflow', 'add-reference')
  }

  _editReference(reference) {
    const api = this.context.api
    const model = api.getModel('reference', reference)
    this.send('startWorkflow', 'edit-reference', model)
  }

  _removeReference(reference) {
    const api = this.context.api
    const collection = api.getModel('references')
    collection.removeItem(reference)
  }

  _getBibliography() {
    const api = this.context.api
    const referenceManager = api.getReferenceManager()
    return referenceManager.getBibliography()
  }
}
