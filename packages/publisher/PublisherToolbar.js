'use strict';

var ProseEditorToolbar = require('substance/packages/prose-editor/ProseEditorToolbar');

function PublisherToolbar() {
  PublisherToolbar.super.apply(this, arguments);
}

PublisherToolbar.Prototype = function() {

  var _super = PublisherToolbar.super.prototype;

  this.render = function($$) { // eslint-disable-line
     // TODO: we should introduce a common Toolbar
    // HACKing ProseEditorToolbar to fit our needs
    var el = _super.render.apply(this, arguments);
    el.removeClass('sc-prose-editor-toolbar').addClass('sc-publisher-toolbar');
    return el;
  };
};

ProseEditorToolbar.extend(PublisherToolbar);

module.exports = PublisherToolbar;
