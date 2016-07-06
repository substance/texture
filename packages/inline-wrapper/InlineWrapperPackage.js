'use strict';

var SubstanceInlineWrapperPackage = require('substance/packages/inline-wrapper/InlineWrapperPackage');
var InlineWrapperJATSConverter = require('./InlineWrapperJATSConverter');

module.exports = {
  name: 'inline-wrapper',

  configure: function(config) {
    config.import(SubstanceInlineWrapperPackage);
    config.addConverter('jats', InlineWrapperJATSConverter);
  }
};
