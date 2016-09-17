'use strict';

import Bold from './Bold'
import BoldConverter from './BoldConverter'
import BoldTool from './BoldTool'
import BoldCommand from './BoldCommand'

export default {
  name: 'bold',
  configure: function(config) {
    config.addNode(Bold);
    config.addConverter('jats', BoldConverter);
    config.addCommand(Bold.type, BoldCommand, { nodeType: Bold.type });
    config.addTool(Bold.type, BoldTool, {target: 'annotations'});
    config.addIcon(Bold.type, { 'fontawesome': 'fa-bold' });
    config.addLabel(Bold.type, {
      en: 'Bold'
    });
  }
};
