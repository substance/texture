'use strict';

var CodePackage = require('substance/packages/code/CodePackage');
var MonospaceJATSConverter = require('./MonospaceJATSConverter');

module.exports = {
  name: 'monospace',
  configure: function(config) {
    config.import(CodePackage);
    config.addConverter('jats', MonospaceJATSConverter);
  }
};