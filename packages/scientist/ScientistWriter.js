'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Layout = require('substance/ui/Layout');
var ScientistWriterTools = require('./ScientistWriterTools');
var ScientistWriterOverlay = require('./ScientistWriterOverlay');
var ScientistSaveHandler = require('./ScientistSaveHandler');
var ScientistTOCProvider = require('./ScientistTOCProvider');
var TOC = require('substance/ui/TOC');

function ScientistWriter() {
  ScientistWriter.super.apply(this, arguments);

  this.handleActions({
    'tocEntrySelected': this.tocEntrySelected
  });
}

ScientistWriter.Prototype = function() {
  var _super = ScientistWriter.super.prototype;

  this._initialize = function() {
    _super._initialize.apply(this, arguments);

    this.exporter = this.props.configurator.createExporter('jats');
    this.saveHandler = new ScientistSaveHandler({
      xmlStore: this.context.xmlStore,
      exporter: this.exporter
    });
    this.documentSession.setSaveHandler(this.saveHandler);
    this.tocProvider = new ScientistTOCProvider(this.documentSession);
  };

  this.getChildContext = function() {
    var childContext = _super.getChildContext.apply(this, arguments);
    childContext.tocProvider = this.tocProvider;
    return childContext;
  };

  this.tocEntrySelected = function(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId);
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-scientist-writer');
    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '300px'}).append(
        this._renderContextSection($$),
        this._renderMainSection($$)
      )
    );
    return el;
  };

  this._renderContentPanel = function($$) {
    var doc = this.documentSession.getDocument();
    var configurator = this.props.configurator;

    var contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'right',
      overlay: ScientistWriterOverlay,
    }).ref('contentPanel');

    var layout = $$(Layout, {
      width: 'large'
    });

    var front = doc.get('front');
    var frontSection = $$('div').addClass('se-front-section').append(
      $$('h1').append('Front'),
      $$(ContainerEditor, {
        node: front,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('front')
    );
    layout.append(frontSection);

    // Body editor
    var body = doc.get('body');
    if (body) {
      var bodySection = $$('div').addClass('se-body-section').append(
        $$('h1').append('Body'),
        $$(ContainerEditor, {
          node: body,
          commands: configurator.getSurfaceCommandNames(),
          textTypes: configurator.getTextTypes()
        }).ref('body')
      );
      layout.append(bodySection);
    }

    // Back matter editor
    var back = doc.get('back');
    if (back) {
      var backSection = $$('div').addClass('se-back-section').append(
        $$('h1').append('Back'),
        $$(ContainerEditor, {
          node: back,
          commands: configurator.getSurfaceCommandNames(),
          textTypes: configurator.getTextTypes()
        }).ref('back')
      );
      layout.append(backSection);
    }

    contentPanel.append(layout);
    return contentPanel;
  };

  this._renderContextSection = function($$) {
    return $$('div').addClass('se-context-section').append(
      $$(TOC)
    );
  };

  this._renderMainSection = function($$) {
    var commandStates = this.commandManager.getCommandStates();
    var mainSection = $$('div').addClass('se-main-sectin');
    var splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      // TODO: ProseEditor needs 'toolbar' ref
      $$(ScientistWriterTools, {
        commandStates: commandStates
      }).ref('toolbar'),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane);
    return mainSection;
  };

};

ProseEditor.extend(ScientistWriter);

module.exports = ScientistWriter;
