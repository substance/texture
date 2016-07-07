'use strict';

var substanceGlobals = require('substance/util/substanceGlobals');
substanceGlobals.DEBUG_RENDERING = true;

var Component = require('substance/ui/Component');
var Scientist = require('../../packages/scientist/Scientist');
var ScientistConfigurator = require('../../packages/scientist/ScientistConfigurator');
var JATSEditorPackage = require('./package');
var configurator = new ScientistConfigurator(JATSEditorPackage);

function App() {
  App.super.apply(this, arguments);
}

App.Prototype = function() {

  this.getInitialState = function() {
    return {
      documentId: 'elife-00007',
    };
  };

  this.render = function($$) {
    var documentId = this.state.documentId;
    var el = $$('div').append(
      $$(Scientist, {
        mode: 'publisher',
        documentId: documentId,
        configurator: configurator
      })
    );
    return el;
  };
};

Component.extend(App);

window.onload = function() {
  window.app = App.static.mount(document.body);
};
