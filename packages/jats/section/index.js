'use strict';

var Section = require('./Section');
var SectionComponent = require('./SectionComponent');
var SectionConverter = require('./SectionConverter');
var SectionTransformer = require('./SectionTransformer');

module.exports = {
  name: 'section',
  configure: function(config) {
    config.addNode(Section);
    config.addComponent('section', SectionComponent);
    config.addConverter('jats', SectionConverter);
    config.addConverter('jats-to-internal', SectionTransformer);
  }
};
