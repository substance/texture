'use strict';

var SuperscriptPackage = require('substance/packages/superscript/SuperscriptPackage');
var SuperscriptJATSConverter = require('./SuperscriptJATSConverter');

module.exports = {
  name: 'superscript',
  configure: function(config) {
    config.import(SuperscriptPackage);
    config.addConverter('jats', SuperscriptJATSConverter);
  }
};