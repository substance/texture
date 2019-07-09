import { domHelpers } from 'substance'
import { Tool } from '../../kit'

export default class OpenFigurePanelImageTool extends Tool {
  render ($$) {
    let el = super.render($$)
    el.append(
      $$('a').ref('link')
        .attr('target', '_blank')
        // ATTENTION: stop propagation, otherwise infinite loop
        .on('click', domHelpers.stop)
    )
    return el
  }

  getClassNames () {
    return 'sc-open-figure-panel-source-tool sc-tool'
  }

  _onClick (e) {
    e.stopPropagation()
    e.preventDefault()
    this._generateLink()
  }

  _generateLink () {
    const urlResolver = this.context.urlResolver
    const editorSession = this.context.editorSession
    const selectionState = editorSession.getSelectionState()
    const node = selectionState.node
    let currentPanel = node
    if (node.type === 'figure') {
      const panels = node.getPanels()
      const currentIndex = node.getCurrentPanelIndex()
      currentPanel = panels[currentIndex]
    }
    const graphic = currentPanel.resolve('content')
    const url = urlResolver.resolveUrl(graphic.href)
    if (url) {
      this.refs.link.el.attr({
        'href': url
      })
      this.refs.link.el.click()
    }
  }
}
