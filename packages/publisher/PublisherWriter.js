'use strict';

var AbstractWriter = require('../common/AbstractWriter');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Layout = require('substance/ui/Layout');
var Overlay = require('substance/ui/DefaultOverlay');
var PublisherTOCProvider = require('./PublisherTOCProvider');
var TOC = require('substance/ui/TOC');

function PublisherWriter() {
  PublisherWriter.super.apply(this, arguments);
}

PublisherWriter.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-publisher-writer');
    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '300px'}).append(
        this._renderContextSection($$),
        this._renderMainSection($$)
      )
    );
    return el;
  };

  this._renderContextSection = function($$) {
    return $$('div').addClass('se-context-section').append(
      $$(TOC)
    );
  };

  this._renderMainSection = function($$) {
    var mainSection = $$('div').addClass('se-main-sectin');
    var splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane);
    return mainSection;
  };

  this._renderContentPanel = function($$) {
    var doc = this.documentSession.getDocument();
    var configurator = this.props.configurator;

    var contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'right',
      overlay: Overlay,
    }).ref('contentPanel');

    var layout = $$(Layout, {
      width: 'large'
    });

    var front = doc.get('front');
    var frontSection = $$('div').addClass('se-front-section').append(
      $$('h1').append('Front'),
      $$(ContainerEditor, {
        disabled: this.props.disabled,
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
          disabled: this.props.disabled,
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
          disabled: this.props.disabled,
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

  this._scrollTo = function(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId);
  };

  this._getExporter = function() {
    return this.props.configurator.createExporter('jats');
  };

  this._getTOCProvider = function() {
    return new PublisherTOCProvider(this.documentSession);
  };

};

AbstractWriter.extend(PublisherWriter);

module.exports = PublisherWriter;
