'use strict';

var Component = require('substance/ui/Component');
var JATSImporter = require('../converter/JATSImporter');
var jQuery = require('substance/util/jquery');
var DocumentSession = require('substance/model/DocumentSession');
var ScientistReader = require('./ScientistReader');
var ScientistWriter = require('./ScientistWriter');

/*
  Loads and displays a ScientistArticle

  Renders ScientistReader on mobile and ScientistWriter on the desktop
*/
function DocumentPage() {
  Component.apply(this, arguments);
}

DocumentPage.Prototype = function() {

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
      this._loadDocument(this.props.documentId);
    }
  };

  this._loadDocument = function() {
    jQuery.ajax(this.props.documentId, {
      dataType: 'text'
    })
    .done(function(data){
      var importer = new JATSImporter();
      var doc = importer.importDocument(data);
      var documentSession = new DocumentSession(doc);

      this.setState({
        documentSession: documentSession
      });
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error(err);
      this.setState({
        error: new Error('Loading failed')
      });
    }.bind(this));
  };

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-document-page');

    if (!this.state.documentSession) {
      return el;
    }

    if (this.state.error) {
      el.append('ERROR: ', this.state.error.message);
    }

    // Display reader for mobile and writer on desktop
    if (this.state.mobile) {
      el.append(
        $$(ScientistReader, {
          documentSession: this.state.documentSession
        })
      );
    } else {
      el.append(
        $$(ScientistWriter, {
          documentSession: this.state.documentSession
        })
      );
    }
    return el;
  };
};

Component.extend(DocumentPage);
module.exports = DocumentPage;