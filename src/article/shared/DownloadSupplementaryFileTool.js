import { platform, domHelpers } from 'substance'
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
    const url = this._generateUrlLink()
    if (url) {
      this.refs.link.el.attr({
        'href': url
      })
      this.refs.link.el.click()

      if (platform.inBrowser) {
        window.URL.revokeObjectURL(url)
      }
    }
  }

  _generateUrlLink () {
    const editorSession = this.context.editorSession
    const selectionState = editorSession.getSelectionState()
    const node = selectionState.node
    const remote = node.remote
    if (remote) {
      return node.href
    } else {
      const archive = this.context.archive
      if (archive.hasAsset(node.href)) {
        const blob = archive.getBlob(node.href)
        if (blob) {
          if (platform.inBrowser) {
            return window.URL.createObjectURL(blob.blob)
          } else {
            // TODO: what to do in node? maybe a file:// URL?
            return node.href
          }
        } else {
          // TODO: Some error should be displayed to the user
          console.error('Blob missing for a file', node.href)
        }
      } else {
        // TODO: this should not only be on the console, but displayed as an error
        // maybe it should be done as a validator task in future
        console.error('File not found in archive: ' + node.href)
      }
    }
  }
}
