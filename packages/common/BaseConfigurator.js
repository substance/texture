'use strict';

var Configurator = require('substance/util/Configurator');

function BaseConfigurator() {
  BaseConfigurator.super.apply(this, arguments);
}

BaseConfigurator.Prototype = function() {

  this.setXMLStore = function(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass;
  };

  this.getXMLStore = function() {
    var XMLStoreClass = this.config.XMLStoreClass;
    return new XMLStoreClass();
  };
};

Configurator.extend(BaseConfigurator);

module.exports = BaseConfigurator;