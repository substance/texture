'use strict';

var Section = require('./Section');
var SectionComponent = require('./SectionComponent');
var SectionConverter = require('./SectionConverter');

module.exports = {
  name: 'section',
  configure: function(config) {
    config.addNode(Section);
    config.addComponent('section', SectionComponent);
    config.addConverter('jats', SectionConverter);
    config.addStyle(__dirname, '_section.scss');
  }
};
