import { EventEmitter, TOCProvider } from 'substance'

/*
  Manages a table of content for Publisher.

  Used by {@link ui/TOCPanel} and {@link ui/ScrollPane}).

  @class PublisherTOCProvider
  @component

  @prop {model/DocumentSession}
*/
function PublisherTOCProvider(documentSession) {
  EventEmitter.apply(this, arguments);

  this.documentSession = documentSession;
  this.entries = this.computeEntries();
  if (this.entries.length > 0) {
    this.activeEntry = this.entries[0].id;
  } else {
    this.activeEntry = null;
  }
  this.documentSession.on('update', this.handleDocumentChange, this);
}

PublisherTOCProvider.Prototype = function() {

  this.dispose = function() {
    this.documentSession.disconnect(this);
  };

  this.getDocument = function() {
    return this.documentSession.getDocument();
  };

  // Inspects a document change and recomputes the
  // entries if necessary
  this.handleDocumentChange = function(change) { // eslint-disable-line
    var needsUpdate = false;
    if (needsUpdate) {
      this.entries = this.computeEntries();
      this.emit('toc:updated');
    }
  };

  this._computeEntriesForContainer = function(container, level) {
    var doc = this.getDocument();
    var entries = [];
    container.nodes.forEach(function(nodeId) {
      var node = doc.get(nodeId);
      if (node.type === 'section') {
        entries.push({
          id: node.id,
          name: node.getTitle(),
          level: level,
          node: node
        });

        // Sections may contain subsections
        entries = entries.concat(
          this._computeEntriesForContainer(node, level + 1)
        );
      }
    }.bind(this));
    return entries;
  };

  this.computeEntries = function() {
    var doc = this.getDocument();
    var body = doc.get('body');
    var level = 1;
    var entries = this._computeEntriesForContainer(body, level);
    return entries;
  };

  this.getEntries = function() {
    return this.entries;
  };

  this.markActiveEntry = TOCProvider.prototype.markActiveEntry;
};

EventEmitter.extend(PublisherTOCProvider);

export default PublisherTOCProvider;
