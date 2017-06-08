import { EventEmitter, TOCProvider } from 'substance'

/*
  Manages a table of content for Publisher.

  Used by {@link ui/TOCPanel} and {@link ui/ScrollPane}).

  @class PublisherTOCProvider
  @component

  @prop {model/EditorSession}
*/
class PublisherTOCProvider extends EventEmitter {
  constructor(editorSession) {
    super(editorSession)

    this.editorSession = editorSession
    this.entries = this.computeEntries()
    if (this.entries.length > 0) {
      this.activeEntry = this.entries[0].id
    } else {
      this.activeEntry = null;
    }
    this.editorSession.onUpdate('document', this.handleDocumentChange, this)
  }

  dispose() {
    this.editorSession.off(this)
  }

  getDocument() {
    return this.editorSession.getDocument()
  }

  // Inspects a document change and recomputes the
  // entries if necessary
  handleDocumentChange(change) { // eslint-disable-line
    // FIXME
    // let needsUpdate = false
    // if (needsUpdate) {
    //   this.entries = this.computeEntries()
    //   this.emit('toc:updated')
    // }
  }

  _computeEntriesForContainer(container, level) {
    let doc = this.getDocument()
    let entries = []
    container.nodes.forEach(function(nodeId) {
      let node = doc.get(nodeId)
      if (node.type === 'section') {
        entries.push({
          id: node.id,
          name: node.getTitle(),
          level: level,
          node: node
        })

        // Sections may contain subsections
        entries = entries.concat(
          this._computeEntriesForContainer(node, level + 1)
        )
      }
    }.bind(this))
    return entries
  }

  computeEntries() {
    let doc = this.getDocument()
    let body = doc.get('body')
    let level = 1
    let entries = this._computeEntriesForContainer(body, level)
    return entries
  }

  getEntries() {
    return this.entries
  }

}

PublisherTOCProvider.prototype.markActiveEntry = TOCProvider.prototype.markActiveEntry

export default PublisherTOCProvider
