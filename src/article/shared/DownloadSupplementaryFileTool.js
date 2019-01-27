import { Tool } from '../../kit'

export default class DownloadSupplementaryFileTool extends Tool {
  render ($$) {
    let el = super.render($$)

    const link = $$('a')
      .ref('link')

    el.append(link)
    return el
  }

  getClassNames () {
    return 'sc-download-file-tool'
  }

  _onClick (e) {
    e.stopPropagation()
    e.preventDefault()
    const url = this._generateUrlLink()
    if (url) {
      // TODO: we should do it rather via our components API,
      // but for now it is not working:
      // this.refs.link.el.attr({
      //   'href': url,
      // })
      // this.refs.link.el.click()
      const a = document.createElement('a')
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
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
      const fileId = node.href.split('.')[0]
      if (fileId) {
        const archive = this.context.archive
        const blob = archive.buffer.getBlob(fileId)
        if (blob) {
          return window.URL.createObjectURL(blob.blob)
        }
      }
      console.error('Blob missed for a file', node.href)
    }
  }
}
