import { domHelpers } from 'substance'
import { Tool } from '../../kit'

export default class DownloadSupplementaryFileTool extends Tool {
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
    return 'sc-download-supplementary-file-tool'
  }

  _onClick (e) {
    e.stopPropagation()
    e.preventDefault()
    this._triggerDownload()
  }

  _triggerDownload () {
    const archive = this.context.archive
    const editorSession = this.context.editorSession
    const selectionState = editorSession.getSelectionState()
    const node = selectionState.node
    const isLocal = !node.remote
    let url = node.href
    if (isLocal) {
      url = archive.getDownloadLink(node.href)
    }
    if (url) {
      this.refs.link.el.attr({
        'href': url
      })
      this.refs.link.el.click()
    }
  }
}
