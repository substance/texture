'use strict';

var SubscriptPackage = require('substance/packages/subscript/SubscriptPackage');
var SubscriptJATSConverter = require('./SubscriptJATSConverter');

module.exports = {
  name: 'subscript',
  configure: function(config) {
    config.import(SubscriptPackage);
    config.addConverter('jats', SubscriptJATSConverter);
  }
};