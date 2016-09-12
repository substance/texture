'use strict';

import Aff from './Aff'
import AffComponent from './AffComponent'
import AffConverter from './AffConverter'
import TagAffCommand from './TagAffCommand'
import TagAffTool from './TagAffTool'

export default {
  name: 'aff',
  configure: function(config) {
    config.addNode(Aff)
    config.addComponent(Aff.type, AffComponent);
    config.addConverter('jats', AffConverter);
    config.addCommand('tag-aff', TagAffCommand);
    config.addTool('tag-aff', TagAffTool);
    config.addIcon('tag-aff', { 'fontawesome': 'fa-bullseye' });
  }
}
