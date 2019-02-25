import { CustomSurface } from 'substance'
import { renderNode } from '../../kit'
import { getPos } from './nodeHelpers'

export default class ReferenceListComponent extends CustomSurface {
  didMount () {
    super.didMount()

    const appState = this.context.appState
    appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: ['article', 'references'] } })
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    super.dispose()
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
    const sel = this.context.appState.selection
    const bibliography = this._getBibliography()

    let el = $$('div').addClass('sc-reference-list')
      .attr('data-id', 'ref-list')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    bibliography.forEach(ref => {
      const referenceEl = renderNode($$, this, ref)
        .ref(ref.id)
        .on('click', this._selectReference.bind(this, ref.id))

      if (sel && sel.customType === 'reference' && sel.data.referenceId === ref.id) {
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
    references.sort((a, b) => {
      return getPos(a) - getPos(b)
    })
    return references
  }

  _selectReference (referenceId) {
    const newSel = {
      type: 'custom',
      customType: 'reference',
      nodeId: referenceId,
      data: {
        referenceId
      }
    }
    this.context.editorSession.setSelection(newSel)
  }
}
