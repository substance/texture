'use strict';

import Section from './Section'
import SectionComponent from './SectionComponent'
import SectionConverter from './SectionConverter'

export default {
  name: 'section',
  configure: function(config) {
    config.addNode(Section);
    config.addComponent('section', SectionComponent);
    config.addConverter('jats', SectionConverter);
  }
};
