'use strict';

var AbstractWriter = require('../common/AbstractWriter');
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
    var el = $$('div').addClass('sc-publisher');
    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeB: '400px'}).append(
        this._renderMainSection($$),
        this._renderContextSection($$)
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
    var mainSection = $$('div').addClass('se-main-section');
    var splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane);
    return mainSection;
  };

  this._renderContentPanel = function($$) {
    var doc = this.documentSession.getDocument();

    var contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      overlay: Overlay,
    }).ref('contentPanel');

    var layout = $$(Layout, {
      width: 'large'
    });

    var ArticleComponent = this.componentRegistry.get('article');

    var article = doc.get('article');
    layout.append(
      $$(ArticleComponent, {
        node: article,
        bodyId: 'body',
        disabled: this.props.disabled,
        configurator: this.props.configurator
      })
    );

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
