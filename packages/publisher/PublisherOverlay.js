'use strict';

var ProseEditorOverlay = require('substance/packages/prose-editor/ProseEditorOverlay');

function PublisherOverlay() {
  PublisherOverlay.super.apply(this, arguments);
}

ProseEditorOverlay.extend(PublisherOverlay);

module.exports = PublisherOverlay;
