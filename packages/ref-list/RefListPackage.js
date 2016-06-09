'use strict';

var RefList = require('./RefList');
var RefListJATSConverter = require('./RefListJATSConverter');
var RefListComponent = require('./RefListComponent');

module.exports = {
  name: 'ref-list',
  configure: function(config) {
    config.addNode(RefList);
    config.addComponent(RefList.static.name, RefListComponent);
    config.addConverter('jats', RefListJATSConverter);
  }
};