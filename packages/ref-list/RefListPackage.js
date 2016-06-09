'use strict';

var RefList = require('./RefList');
var RefListJATSConverter = require('./RefListJATSConverter');

module.exports = {
  name: 'ref-list',
  configure: function(config) {
    config.addNode(RefList);
    config.addConverter('jats', RefListJATSConverter);
  }
};