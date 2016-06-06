'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Toolbar = require('substance/ui/Toolbar');
var Layout = require('substance/ui/Layout');
var ScientistWriterTools = require('./ScientistWriterTools');
var ScientistWriterOverlay = require('./ScientistWriterOverlay');
var ScientistSaveHandler = require('./ScientistSaveHandler');


function ScientistWriter() {
  ScientistWriter.super.apply(this, arguments);
}

ScientistWriter.Prototype = function() {
  var _super = ScientistWriter.super.prototype;

  this._initialize = function() {
    _super._initialize.apply(this, arguments);
    this.saveHandler = new ScientistSaveHandler({
      xmlStore: this.context.xmlStore
    });
    this.documentSession.setSaveHandler(this.saveHandler);
  };

  this.render = function($$) {
    var configurator = this.props.configurator;
    return $$('div').addClass('sc-editor').append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        $$(Toolbar, {
          content: ScientistWriterTools
        }),
        $$(ScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'right',
          overlay: ScientistWriterOverlay,
        }).append(
          $$(Layout, {
            width: 'large'
          }).append(
            $$(ContainerEditor, {
              documentSession: this.documentSession,
              containerId: 'body',
              name: 'body',
              commands: configurator.getSurfaceCommandNames(),
              textTypes: configurator.getTextTypes()
            }).ref('body')
          )
        ).ref('contentPanel')
      )
    );
  };
};

ProseEditor.extend(ScientistWriter);

module.exports = ScientistWriter;