'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Toolbar = require('substance/ui/Toolbar');
var Layout = require('substance/ui/Layout');
var ScientistWriterTools = require('./ScientistWriterTools');
var ScientistWriterOverlay = require('./ScientistWriterOverlay');

function ScientistWriter() {
  ScientistWriter.super.apply(this, arguments);
}

ScientistWriter.Prototype = function() {
  this.render = function($$) {
    console.log('this.props.configurator', this.props.configurator);
    return $$('div').append('TODO_IMPLEMENT_SCIENCE_WRITER');
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