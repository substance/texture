'use strict';

var Table = require('./Table');
var TableComponent = require('./TableComponent');
var TableConverter = require('./TableConverter');

module.exports = {
  name: 'table',
  configure: function(config) {
    config.addNode(Table);
    config.addComponent(Table.static.name, TableComponent);
    config.addConverter('jats', TableConverter);
  }
};