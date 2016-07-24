'use strict';

var TableWrap = require('./TableWrap');
var TableWrapConverter = require('./TableWrapConverter');
var TableWrapComponent = require('./TableWrapComponent');

module.exports = {
  name: 'table-wrap',
  configure: function(config) {
    config.addNode(TableWrap);
    config.addComponent(TableWrap.type, TableWrapComponent);
    config.addConverter('jats', TableWrapConverter);
  }
};