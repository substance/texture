'use strict';

var StrongPackage = require('substance/packages/strong/StrongPackage');
var StrongJATSConverter = require('./StrongJATSConverter');

module.exports = {
  name: 'strong',
  configure: function(config) {
    config.import(StrongPackage);
    config.addConverter('jats', StrongJATSConverter);
  }
};