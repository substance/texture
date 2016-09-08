'use strict';

import Label from './Label'
import LabelConverter from './LabelConverter'
import LabelComponent from './LabelComponent'

export default {
  name: 'label',
  configure: function(config) {
    config.addNode(Label);
    config.addComponent(Label.type, LabelComponent);
    config.addConverter('jats', LabelConverter);
  }
};
