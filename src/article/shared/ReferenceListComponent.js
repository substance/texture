import { Component } from 'substance'
import { NodeModelFactory } from '../../kit'

export default class ReferenceListComponent extends Component {
  didMount () {
    // TODO: as we have a node for references now, we should turn this into a NodeComponent instead
    this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: ['references'] } })
  }

  dispose () {
    // TODO: as we have a node for references now, we should turn this into a NodeComponent instead
    this.context.appState.removeObserver(this)
  }

  getInitialState () {
    let bibliography = this._getBibliography()
    return {
      hidden: (bibliography.length === 0)
    }
  }

  render ($$) {
    const ReferenceComponent = this.getComponent('bibr')
    const bibliography = this._getBibliography()

    let el = $$('div').addClass('sc-reference-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    // ATTENTION: bibliography still works with document nodes
    bibliography.forEach(refNode => {
      let model = NodeModelFactory.create(this.context.api, refNode)
      el.append(
        $$(ReferenceComponent, { model })
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
