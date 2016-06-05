'use strict';

var TableWrap = require('./TableWrap');
var TableWrapJATSConverter = require('./TableWrapJATSConverter');
var TableWrapComponent = require('./TableWrapComponent');

module.exports = {
  name: 'table-wrap',
  configure: function(config) {
    config.addNode(TableWrap);
    config.addComponent(TableWrap.static.name, TableWrapComponent);
    config.addConverter('jats', TableWrapJATSConverter);
  }
};