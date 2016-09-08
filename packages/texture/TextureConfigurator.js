import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'
import { Configurator } from 'substance'

/*
  Top-level configurator for scientist. Has sub-configurators for
  all available modules (author, publisher, reader).
*/
function TextureConfigurator() {
  TextureConfigurator.super.apply(this, arguments);

  // Extend config
  this.config.configurators = {};
  this.config.XMLStoreClass = null;
}

TextureConfigurator.Prototype = function() {

  /*
    Provision of sub configurators (e.g. Author, Publisher, Reader
    receive their own configurator)
  */
  this.addConfigurator = function(name, configurator) {
    this.config.configurators[name] = configurator;
  };

  this.getConfigurator = function(name) {
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

Configurator.extend(TextureConfigurator);

export default TextureConfigurator
