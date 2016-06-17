'use strict';

var Configurator = require('substance/util/Configurator');

function ScientistConfigurator() {
  ScientistConfigurator.super.apply(this, arguments);
}

ScientistConfigurator.Prototype = function() {

  this.setXMLStore = function(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass;
  };

  this.getXMLStore = function() {
    var XMLStoreClass = this.config.XMLStoreClass;
    return new XMLStoreClass();
  };
}

Configurator.extend(ScientistConfigurator);

module.exports = ScientistConfigurator;