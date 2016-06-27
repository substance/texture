'use strict';

var Configurator = require('substance/util/Configurator');

function PublisherConfigurator() {
  PublisherConfigurator.super.apply(this, arguments);
}

PublisherConfigurator.Prototype = function() {

  this.setXMLStore = function(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass;
  };

  this.getXMLStore = function() {
    var XMLStoreClass = this.config.XMLStoreClass;
    return new XMLStoreClass();
  };
};

Configurator.extend(PublisherConfigurator);

module.exports = PublisherConfigurator;