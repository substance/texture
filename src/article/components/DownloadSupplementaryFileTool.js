import { $$, domHelpers, platform } from 'substance'
import { Tool } from '../../kit'

export default class DownloadSupplementaryFileTool extends Tool {
  render () {
    let el = super.render()
    let link = $$('a').ref('link')
      // ATTENTION: stop propagation, otherwise infinite loop
      .on('click', domHelpers.stop)

    // Downloading is a bit involved:
    // In electron, everything can be done with one solution,
    // handling a 'will-download' event, which is triggered when the `download`
    // attribute is present.
    // For the browser, the `download` attribute works only for files from the same
    // origin. For remote files the best we can do at the moment, is opening
    // a new tab, and let the browser deal with it.
    // TODO: if this feature is important, one idea is that the DAR server could
    // provide an end-point to provide download-urls, and act as a proxy to
    // cirvumvent the CORS problem.
    const isLocal = this._isLocal()
    if (platform.inElectron || isLocal) {
      link.attr('download', '')
    } else {
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
    const node = this._getNode()
    const isLocal = this._isLocal()
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

  _getNode () {
    return this.props.commandState.node
  }

  _isLocal () {
    let node = this._getNode()
    return (!node || !node.remote)
  }
}
