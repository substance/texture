'use strict';

var Component = require('substance/ui/Component');

/*
  Loads and displays a Scientist article

  Renders ScientistReader on mobile and ScientistWriter on the desktop
*/
function DocumentPage() {
  Component.apply(this, arguments);
}

DocumentPage.Prototype = function() {

  this.getInitialState = function() {
    return {
      documentSession: null, // CollabSession will be stored here, if null indicates we are in loading state
      error: null // used to display error messages e.g. loading of document failed
    };
  };

  this.didMount = function() {
    // load the document after mounting
    this._loadDocument(this.getDocumentId());
  };

  this.willReceiveProps = function(newProps) {
    if (newProps.documentId !== this.props.documentId) {
      this.dispose();
      this.state = this.getInitialState();
      this._loadDocument(this.getDocumentId());
    }
  };

  this._loadDocument = function(cb) {
    // TODO: load doc here
  };

  // Rendering
  // ------------------------------------

  this.renderPage = function($$) {
    var el = $$('div').addClass('sc-document-page');

    if (!this.state.documentSession) {
      return el;
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