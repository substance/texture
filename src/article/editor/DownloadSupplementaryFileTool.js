import { domHelpers, platform } from 'substance'
import { Tool } from '../../kit'

export default class DownloadSupplementaryFileTool extends Tool {
  render ($$) {
    let el = super.render($$)
    let link = $$('a').ref('link')
      // Downloads a non-remote urls
      .attr('download', '')
      // ATTENTION: stop propagation, otherwise infinite loop
      .on('click', domHelpers.stop)

    el.append(link)
    return el
  }

  getClassNames () {
    return 'sc-download-supplementary-file-tool sc-tool'
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
      // Note: in the browser version we want to open remote files in a new tab
      if (!platform.inElectron && !isLocal) {
        this.refs.link.attr('target', '_blank')
      }
      this.refs.link.el.click()
    }
  }
}
