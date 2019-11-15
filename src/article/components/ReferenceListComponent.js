import { CustomSurface } from 'substance'
import { renderNode, NodeComponent } from '../../kit'
import { sortCitationsByNameYear } from '../shared/nodeHelpers'

export default class ReferenceListComponent extends CustomSurface {
  didMount () {
    super.didMount()

    const appState = this.context.editorState
    appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: ['article', 'references'] } })
    // TODO: it is not good to rerender on every selection change.
    // Instead derive a meaningful state, and render if the state changes
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    super.dispose()
    // TODO: as we have a node for references now, we should turn this into a NodeComponent instead
    this.context.editorState.removeObserver(this)
  }

  getInitialState () {
    let bibliography = this._getBibliography()
    return {
      hidden: (bibliography.length === 0)
    }
  }

  render ($$) {
    const sel = this.context.editorState.selection
    const bibliography = this._getBibliography()

    let el = $$('div').addClass('sc-reference-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    bibliography.forEach(ref => {
      const referenceEl = $$(ReferenceDisplay, { node: ref }).ref(ref.id)
      if (sel && sel.nodeId === ref.id) {
        referenceEl.addClass('sm-selected')
      }
      el.append(referenceEl)
    })

    return el
  }

  _getCustomResourceId () {
    return 'reference-list'
  }

  _getBibliography () {
    let references = this.props.model.getItems()
    references.sort(sortCitationsByNameYear);
    return references
  }
}

class ReferenceDisplay extends NodeComponent {
  render ($$) {
    let el = renderNode($$, this, this.props.node)
    el.on('mousedown', this._onMousedown)
      .on('click', this._onClick)
    return el
  }

  _onMousedown (e) {
    e.stopPropagation()
    if (e.button === 2) {
      this._select()
    }
  }

  _onClick (e) {
    e.stopPropagation()
    this._select()
  }

  _select () {
    this.context.api.selectEntity(this.props.node.id)
  }
}
