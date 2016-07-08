'use strict';

var Configurator = require('substance/util/Configurator');
var JATSPackage = require('../../packages/jats/package');
var InlineWrapperPackage = require('../../packages/inline-wrapper/InlineWrapperPackage');
var UnsupportedNodePackage = require('../../packages/unsupported/UnsupportedNodePackage');

module.exports = function createJATSConfigurator() {
  var configurator = new Configurator();
  configurator.import(JATSPackage);
    // support inline wrappers, for all hybrid types that can be
  // block-level but also inline.
  configurator.import(InlineWrapperPackage);
  // catch all converters
  configurator.import(UnsupportedNodePackage);
  return configurator;
};
