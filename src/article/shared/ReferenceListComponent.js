import { Component } from 'substance'
import { Button } from '../../kit'

export default class ReferenceListComponent extends Component {
  getInitialState () {
    let bibliography = this._getBibliography()
    return {
      hidden: (bibliography.length === 0)
    }
  }

  render ($$) {
    const RefComponent = this.getComponent('ref')
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

    // ATTENTION: bibliography still works with document nodes
    bibliography.forEach(ref => {
      const node = ref._node
      el.append(
        $$('div').addClass('se-ref-item').append(
          $$(RefComponent, { node }),
          $$('div').addClass('se-ref-actions').append(
            $$(Button, {icon: 'pencil', tooltip: this.getLabel('edit-ref')})
              .on('click', this._editReference.bind(this, node)),
            $$(Button, {icon: 'trash', tooltip: this.getLabel('remove-ref')})
              .on('click', this._removeReference.bind(this, node))
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

  _addNewReference () { // eslint-disable-line
    this.send('startWorkflow', 'add-reference')
  }

  _editReference (reference) { // eslint-disable-line
    const api = this.context.api
    const model = api._getModelForNode(reference)
    this.send('startWorkflow', 'edit-reference', {model: model})
  }

  _removeReference (reference) { // eslint-disable-line
    console.error('TODO: implement ReferenceListComponent._editReference()')
  }

  _getBibliography () {
    const api = this.context.api
    const referenceManager = api.getReferenceManager()
    return referenceManager.getBibliography()
  }
}
