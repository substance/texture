'use strict';

var extend = require('lodash/extend');
var Component = require('substance/ui/Component');
var Router = require('substance/ui/Router');
var Configurator = require('./BaseConfigurator');

function BasicApp() {
  BasicApp.super.apply(this, arguments);

  this.router = new Router();
  this.configurator = new Configurator(this.getConfiguration());
}

BasicApp.Prototype = function() {

  this.didMount = function() {
    this.router.on('route:changed', this.onRouteChange, this);
    this.router.start();
  };

  this.dispose = function() {
    this.router.off(this);
    this.router.dispose();
  };

  this.getDefaultState = function() {
    return {};
  };

  this.getConfiguration = function() {
    throw new Error('This method is abstract');
  };

  this.getInitialState = function() {
    this.router = new Router();
    var state = extend({}, this.getDefaultState(), this.router.readRoute());
    return state;
  };

  this.render = function($$) { // eslint-disable-line
    throw new Error('This method is abstract.');
  };

  this.onRouteChange = function(newState) {
    this.setState(extend({}, this.getDefaultState(), newState));
  };

};

Component.extend(BasicApp);

module.exports = BasicApp;
