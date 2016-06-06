'use strict';

var Component = require('substance/ui/Component');
var DocumentSession = require('substance/model/DocumentSession');
var ScientistReader = require('./ScientistReader');
var ScientistWriter = require('./ScientistWriter');

/*
  Scientist Component

  Based on given props displays an editor or viewer
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

  this._loadDocument = function() {
    var configurator = this.props.configurator;

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
      var documentSession = new DocumentSession(doc);

      this.setState({
        documentSession: documentSession
      });
    }.bind(this));
  };

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var configurator = this.props.configurator;
    var el = $$('div').addClass('sc-scientist');

    if (this.state.error) {
      el.append('ERROR: ', this.state.error.message);
      return el;
    }

    if (!this.state.documentSession) {
      return el;
    }

    // Display reader for mobile and writer on desktop
    if (this.props.mobile) {
      el.append(
        $$(ScientistReader, {
          documentSession: this.state.documentSession,
          configurator: configurator
        }).ref('scientistReader')
      );
    } else {
      el.append(
        $$(ScientistWriter, {
          documentSession: this.state.documentSession,
          configurator: configurator
        }).ref('scientistWriter')
      );
    }
    return el;
  };
};

Component.extend(Scientist);
module.exports = Scientist;