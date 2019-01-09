import { Component } from 'substance'
import { renderNode } from '../../kit'
import { getPos } from './nodeHelpers'

export default class ReferenceListComponent extends Component {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: ['article', 'references'] } })
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
    const bibliography = this._getBibliography()

    let el = $$('div').addClass('sc-reference-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    bibliography.forEach(ref => {
      el.append(
        renderNode($$, this, ref)
      )
    })

    return el
  }

  _getBibliography () {
    let references = this.props.model.getItems()
    references.sort((a, b) => {
      return getPos(a) - getPos(b)
    })
    return references
  }
}
