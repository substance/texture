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

    // Body editor
    var body = doc.get('body');
    layout.append(
      $$(ContainerEditor, {
        node: body,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('body')
    );

    // Back matter editor
    var back = doc.get('back');
    if (back) {
      layout.append(
        $$(ContainerEditor, {
          node: back,
          commands: configurator.getSurfaceCommandNames(),
          textTypes: configurator.getTextTypes()
        }).ref('back')
      );
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
    var mainSection = $$('div').addClass('se-main-sectin');
    var splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      $$(Toolbar, {
        content: ScientistWriterTools
      }),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane);
    return mainSection;
  };

};

ProseEditor.extend(ScientistWriter);

module.exports = ScientistWriter;
