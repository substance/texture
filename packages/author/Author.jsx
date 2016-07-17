'use strict';

var AbstractWriter = require('../common/AbstractWriter');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Layout = require('substance/ui/Layout');
var Overlay = require('substance/ui/DefaultOverlay');
var AuthorTOCProvider = require('./AuthorTOCProvider');
var TOC = require('substance/ui/TOC');

function Author() {
  Author.super.apply(this, arguments);
}

Author.Prototype = function() {

  this.render = function($$) {
    return (
      <div class="sc-author">
        <SplitPane splitType="vertical" sizeA="300px">
          { this._renderContextSection($$) }
          { this._renderMainSection($$) }
        </SplitPane>
      </div>
    );
  };

  this._renderContextSection = function($$) {
    return (
      <div class="se-context-section">
        <TOC />
      </div>
    );
  };

  this._renderMainSection = function($$) {
    return (
      <div class="se-main-section">
        <SplitPane splitType="horizontal">
          { this._renderToolbar($$) }
          { this._renderContentPanel($$) }
        </SplitPane>
      </div>
    );
  };

  this._renderContentPanel = function($$) {
    var doc = this.documentSession.getDocument();
    var article = doc.get('article');
    var ArticleComponent = this.componentRegistry.get('article');
    return (
      <ScrollPane
          tocProvider={this.tocProvider}
          scrollbarType="substance" scrollbarPosition="right"
          overlay={Overlay} ref="contentPanel">
        <Layout width="large">
          <ArticleComponent node={article}
            bodyId="bodyFlat" disabled={this.props.disabled}
            configurator={this.props.configurator} />
        </Layout>
      </ScrollPane>
    );
  };

  this._scrollTo = function(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId);
  };

  this._getExporter = function() {
    return this.props.configurator.createExporter('jats');
  };

  this._getTOCProvider = function() {
    return new AuthorTOCProvider(this.documentSession);
  };

};

AbstractWriter.extend(Author);

module.exports = Author;
