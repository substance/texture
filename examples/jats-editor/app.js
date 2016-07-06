'use strict';

var substanceGlobals = require('substance/util/substanceGlobals');
substanceGlobals.DEBUG_RENDERING = true;

var BasicApp = require('../../packages/common/BasicApp');
var JATSEditor = require('./JATSEditor');
var JATSEditorPackage = require('./package');

function App() {
  App.super.apply(this, arguments);
}

App.Prototype = function() {

  this.getDefaultState = function() {
    return {
      documentId: 'elife-00007',
    };
  };

  this.getConfiguration = function() {
    return JATSEditorPackage;
  };

  this.render = function($$) {
    var documentId = this.state.documentId;
    var el = $$('div').append(
      $$(JATSEditor, {
        mode: 'write',
        documentId: documentId,
        configurator: this.configurator
      })
    );
    return el;
  };
};

BasicApp.extend(App);

window.onload = function() {
  window.app = App.static.mount(document.body);
};
