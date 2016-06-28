'use strict';

var RefList = require('./RefList');
var RefListConverter = require('./RefListConverter');
var RefListComponent = require('./RefListComponent');

module.exports = {
  name: 'ref-list',
  configure: function(config) {
    config.addNode(RefList);
    config.addComponent(RefList.static.name, RefListComponent);
    config.addConverter('jats', RefListConverter);
    config.addStyle(__dirname, '_ref-list.scss');
  }
};