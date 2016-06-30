'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var SaveHandler = require('./SaveHandler');

// TODO: we need to think if it is really a good idea to
// derive from ProseEditor here
// There would be a lot of code redundancy
function AbstractWriter() {
  AbstractWriter.super.apply(this, arguments);

  this.handleActions({
    'tocEntrySelected': this.tocEntrySelected
  });
}

AbstractWriter.Prototype = function() {

  var _super = AbstractWriter.super.prototype;

  this._initialize = function() {
    _super._initialize.apply(this, arguments);

    this.exporter = this._getExporter();
    this.tocProvider = this._getTOCProvider();
    this.saveHandler = this._getSaveHandler();
    this.documentSession.setSaveHandler(this.saveHandler);
  };

  this.getChildContext = function() {
    var childContext = _super.getChildContext.apply(this, arguments);
    childContext.tocProvider = this.tocProvider;
    return childContext;
  };

  this._renderToolbar = function($$) { // eslint-disable-line
    return _super._renderToolbar.apply(this, arguments);
  };

  this._renderContentPanel = function($$) { // eslint-disable-line
    throw new Error("This method is abstract.");
  };

  this.tocEntrySelected = function(nodeId) {
    return this._scrollTo(nodeId);
  };

  this._scrollTo = function(nodeId) { // eslint-disable-line
    throw new Error("This method is abstract.");
  };

  this._getExporter = function() {
    throw new Error("This method is abstract.");
  };

  this._getTOCProvider = function() {
    throw new Error("This method is abstract.");
  };

  this._getSaveHandler = function() {
    return new SaveHandler({
      xmlStore: this.context.xmlStore,
      exporter: this.exporter
    });
  };

};

ProseEditor.extend(AbstractWriter);

module.exports = AbstractWriter;
