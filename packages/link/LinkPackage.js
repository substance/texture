'use strict';

var LinkPackage = require('substance/packages/link/LinkPackage');
var LinkJATSConverter = require('./LinkJATSConverter');

module.exports = {
  name: 'link',
  configure: function(config) {
    config.import(LinkPackage);
    config.addConverter('jats', LinkJATSConverter);
  }
};