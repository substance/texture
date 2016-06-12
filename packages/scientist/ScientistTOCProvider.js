"use strict";

var EventEmitter = require('substance/util/EventEmitter');

/*
  Manages a table of content for scientist.

  Used by {@link ui/TOCPanel} and {@link ui/ScrollPane}).

  @class ScientistTOCProvider
  @component

  @prop {model/DocumentSession}
*/
function ScientistTOCProvider(documentSession) {
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

ScientistTOCProvider.Prototype = function() {

  this.dispose = function() {
    this.documentSession.disconnect(this);
  };

  this.getDocument = function() {
    return this.documentSession.getDocument();
  };

  // Inspects a document change and recomputes the
  // entries if necessary
  this.handleDocumentChange = function(change) { // eslint-disable-line
    console.warn('TODO: Compute needsUpdate');
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
          name: node.title,
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
    console.log('entries', entries);
    return entries;
  };

  this.getEntries = function() {
    return this.entries;
  };

  this.markActiveEntry = function(scrollPane) {
    var panelContent = scrollPane.getContentElement();
    var contentHeight = scrollPane.getContentHeight();
    var scrollPaneHeight = scrollPane.getHeight();
    var scrollPos = scrollPane.getScrollPosition();

    var scrollBottom = scrollPos + scrollPaneHeight;
    var regularScanline = scrollPos;
    var smartScanline = 2 * scrollBottom - contentHeight;
    var scanline = Math.max(regularScanline, smartScanline);

    var tocNodes = this.computeEntries();
    if (tocNodes.length === 0) return;

    // Use first toc node as default
    var activeEntry = tocNodes[0].id;
    for (var i = tocNodes.length - 1; i >= 0; i--) {
      var tocNode = tocNodes[i];
      var nodeEl = panelContent.find('[data-id="'+tocNode.id+'"]');
      if (!nodeEl) {
        console.warn('Not found in Content panel', tocNode.id);
        return;
      }
      var panelOffset = scrollPane.getPanelOffsetForElement(nodeEl);
      if (scanline >= panelOffset) {
        activeEntry = tocNode.id;
        break;
      }
    }

    if (this.activeEntry !== activeEntry) {
      this.activeEntry = activeEntry;
      this.emit('toc:updated');
    }
  };
};

EventEmitter.extend(ScientistTOCProvider);

module.exports = ScientistTOCProvider;
