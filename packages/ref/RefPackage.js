'use strict';

var Ref = require('./Ref');
var RefJATSConverter = require('./RefJATSConverter');

module.exports = {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref);
    config.addConverter('jats', RefJATSConverter);
  }
};