import { Overlay, TOC } from 'substance'
import AbstractWriter from '../common/AbstractWriter'
import PublisherTOCProvider from './PublisherTOCProvider'

function PublisherWriter() {
  PublisherWriter.super.apply(this, arguments);
}

PublisherWriter.Prototype = function() {

  this.render = function($$) {
    var SplitPane = this.getComponent('split-pane');
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
    var SplitPane = this.getComponent('split-pane');
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
    var Layout = this.getComponent('layout');
    var ScrollPane = this.getComponent('scroll-pane');

    var contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      overlay: Overlay,
      highlights: this.contentHighlights
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

export default PublisherWriter;
