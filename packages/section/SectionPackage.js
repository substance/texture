'use strict';

var Section = require('./Section');
var SectionComponent = require('./SectionComponent');
var SectionJATSConverter = require('./SectionJATSConverter');
var SectionTransformer = require('./SectionTransformer');

module.exports = {
  name: 'section',
  configure: function(config) {
    config.addNode(Section);
    config.addComponent('section', SectionComponent);
    config.addConverter('jats', SectionJATSConverter);
    config.addConverter('jats-to-internal', SectionTransformer);
  }
};
