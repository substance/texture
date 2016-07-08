'use strict';

var Component = require('substance/ui/Component');
var DocumentSession = require('substance/model/DocumentSession');
var Publisher = require('../../packages/publisher/Publisher');
var Author = require('../../packages/author/Author');

/*
  JATSEditor Component

  Based on given mode prop, displays the Publisher, Author or Reader component
*/
function Scientist() {
  Component.apply(this, arguments);

  var configurator = this.props.configurator;
  this.xmlStore = configurator.getXMLStore();
}

Scientist.Prototype = function() {

  this.getChildContext = function() {
    return {
      xmlStore: this.xmlStore
    };
  };

  this.getInitialState = function() {
    return {
      documentSession: null,
      error: null
    };
  };

  this.didMount = function() {
    // load the document after mounting
    this._loadDocument(this.props.documentId);
  };

  this.willReceiveProps = function(newProps) {
    if (newProps.documentId !== this.props.documentId) {
      this.dispose();
      this.state = this.getInitialState();
      this._loadDocument(newProps.documentId);
    }
  };

  this.dispose = function() {
    this._dispose();
  };

  this._dispose = function() {
    // Note: we need to clear everything, as the childContext
    // changes which is immutable
    this.empty();
  };

  this._loadDocument = function() {
    var configurator = this.getChildConfigurator();

    this.xmlStore.readXML(this.props.documentId, function(err, xml) {
      if (err) {
        console.error(err);
        this.setState({
          error: new Error('Loading failed')
        });
        return;
      }

      var importer = configurator.createImporter('jats');
      var doc = importer.importDocument(xml);
      // HACK: For debug purposes
      window.doc = doc;
      var documentSession = new DocumentSession(doc);

      this.setState({
        documentSession: documentSession
      });
    }.bind(this));
  };

  this.getChildConfigurator = function() {
    var scientistConfigurator = this.props.configurator;
    return scientistConfigurator.getConfigurator(this.props.mode);
  };

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-scientist');

    if (this.state.error) {
      el.append('ERROR: ', this.state.error.message);
      return el;
    }

    if (!this.state.documentSession) {
      return el;
    }

    // Depending on the chosen mode, instantiate
    var ActiveModeClass;
    var configurator = this.getChildConfigurator();

    if (this.props.mode === 'publisher') {
      ActiveModeClass = Publisher;
    } else if (this.props.mode === 'author') {
      ActiveModeClass = Author;
    }

    // Display reader for mobile and writer on desktop
    el.append(
      $$(ActiveModeClass, {
        documentId: this.props.documentId,
        documentSession: this.state.documentSession,
        configurator: configurator
      }).ref('publisher')
    );
    return el;
  };
};

Component.extend(Scientist);

module.exports = Scientist;
