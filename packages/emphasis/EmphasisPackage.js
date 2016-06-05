'use strict';

var EmphasisPackage = require('substance/packages/emphasis/EmphasisPackage');
var EmphasisJATSConverter = require('./EmphasisJATSConverter');

module.exports = {
  name: 'emphasis',
  configure: function(config) {
    config.import(EmphasisPackage);
    config.addConverter('jats', EmphasisJATSConverter);
  }
};