'use strict';

var extend = require('lodash/extend');
var substanceGlobals = require('substance/util/substanceGlobals');
var Component = require('substance/ui/Component');
var Router = require('substance/ui/Router');
var Scientist = require('../../packages/scientist/Scientist');
var ScientistConfigurator = require('../../packages/scientist/ScientistConfigurator');
var JATSEditorConfig = require('./JATSEditorConfig');

var configurator = new ScientistConfigurator();
configurator.import(JATSEditorConfig);

substanceGlobals.DEBUG_RENDERING = true;

function App() {
  App.super.apply(this, arguments);

  this.router = new Router();
}

App.Prototype = function() {

  this.didMount = function() {
    this.router.on('route:changed', this.onRouteChange, this);
    this.router.start();
  };

  this.dispose = function() {
    this.router.off(this);
    this.router.dispose();
  };

  var DEFAULT_STATE = {
    documentId: 'elife-00007',
  };

  this.getInitialState = function() {
    this.router = new Router();
    var state = extend({}, DEFAULT_STATE, this.router.readRoute());
    return state;
  };

  this.render = function($$) {
    var documentId = this.state.documentId;
    var el = $$('div').append(
      $$(Scientist, {
        mode: 'write',
        documentId: documentId,
        configurator: configurator
      })
    );
    return el;
  };

  this.onRouteChange = function(newState) {
    this.setState(extend({}, DEFAULT_STATE, newState));
  };

};

Component.extend(App);

window.onload = function() {
  window.app = App.static.mount(document.body);
};
