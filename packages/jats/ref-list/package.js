'use strict';

import RefList from './RefList'
import RefListConverter from './RefListConverter'
import RefListComponent from './RefListComponent'

export default {
  name: 'ref-list',
  configure: function(config) {
    config.addNode(RefList);
    config.addComponent(RefList.type, RefListComponent);
    config.addConverter('jats', RefListConverter);
  }
};