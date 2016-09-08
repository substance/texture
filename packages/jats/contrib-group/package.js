'use strict';

import ContribGroup from './ContribGroup'
import ContribGroupConverter from './ContribGroupConverter'
import ContribGroupComponent from './ContribGroupComponent'

export default {
  name: 'contrib-group',
  configure: function(config) {
    config.addNode(ContribGroup);
    config.addConverter('jats', ContribGroupConverter);
    config.addComponent(ContribGroup.type, ContribGroupComponent);
  }
};
