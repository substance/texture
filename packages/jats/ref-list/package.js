'use strict';

var RefList = require('./RefList');
var RefListConverter = require('./RefListConverter');
var RefListComponent = require('./RefListComponent');

module.exports = {
  name: 'ref-list',
  configure: function(config) {
    config.addNode(RefList);
    config.addComponent(RefList.type, RefListComponent);
    config.addConverter('jats', RefListConverter);
  }
};