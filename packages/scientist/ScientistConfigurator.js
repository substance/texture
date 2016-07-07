'use strict';

var Configurator = require('substance/util/Configurator');
var forEach = require('lodash/forEach');
var uniq = require('lodash/uniq');

/*
  Top-level configurator for scientist. Has sub-configurators for
  all available modules (author, publisher, reader).
*/
function ScientistConfigurator() {
  ScientistConfigurator.super.apply(this, arguments);
}

ScientistConfigurator.Prototype = function() {

  /*
    Provision of sub configurators (e.g. Author, Publisher, Reader
    receive their own configurator)
  */
  this.addConfigurator = function(name, configurator) {
    if (!this.config.configurators) {
      this.config.configurators = {};
    }
    this.config.configurators[name] = configurator;
  };

  this.getConfigurator = function(name) {
    if (!this.config.configurators) {
      return undefined;
    }
    return this.config.configurators[name];
  };

  this.setXMLStore = function(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass;
  };

  this.getXMLStore = function() {
    var XMLStoreClass = this.config.XMLStoreClass;
    return new XMLStoreClass();
  };

  this.getStyles = function() {
    var styles = [].concat(this.config.styles);

    forEach(this.config.configurators, function(configurator) {
      styles = styles.concat(configurator.getStyles());
    });

    // Remove duplicates with _.uniq, since publisher, author,
    // reader use a lot of shared styles
    return uniq(styles);
  };
};

Configurator.extend(ScientistConfigurator);

module.exports = ScientistConfigurator;