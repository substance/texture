import { Component } from 'substance'
import { Button, NodeModelFactory } from '../../kit'

export default class ReferenceListComponent extends Component {
  getInitialState () {
    let bibliography = this._getBibliography()
    return {
      hidden: (bibliography.length === 0)
    }
  }

  render ($$) {
    const BibliographicEntryComponent = this.getComponent('bibr')
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
    bibliography.forEach(refNode => {
      let model = NodeModelFactory.create(this.context.api, refNode)
      el.append(
        $$('div').addClass('se-ref-item').append(
          $$(BibliographicEntryComponent, { model })
        )
      )
    })

    return el
  }

  _getBibliography () {
    const api = this.context.api
    const referenceManager = api.getReferenceManager()
    return referenceManager.getBibliography()
  }
}
