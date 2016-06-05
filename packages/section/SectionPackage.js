'use strict';

var HeadingPackage = require('substance/packages/heading/HeadingPackage');
var Section = require('./Section');
var SectionJATSConverter = require('./SectionJATSConverter');

module.exports = {
  name: 'section',
  configure: function(config) {
    config.import(HeadingPackage);
    config.addNode(Section);
    config.addConverter('jats', SectionJATSConverter);
  }
};