import { domHelpers, platform } from 'substance'
import { Tool } from '../../kit'

export default class DownloadSupplementaryFileTool extends Tool {
  render ($$) {
    let el = super.render($$)
    let link = $$('a').ref('link')
      // Note: download attribute instructs browsers to download a URL instead of navigating to it
      // but only for same-origin URLs, e.g. it will not work for remote images
      .attr('download', '')
      // ATTENTION: stop propagation, otherwise infinite loop
      .on('click', domHelpers.stop)
    // Note: in the browser version we want to open the download in a new tab
    if (!platform.inElectron) {
      link.attr('target', '_blank')
    }
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
      this.refs.link.el.click()
    }
  }
}
