'use strict';

var Configurator = require('../../packages/common/BaseConfigurator');
var JATSPackage = require('../../packages/jats/package');

module.exports = function createJATSConfigurator() {
  return new Configurator(JATSPackage);
};
