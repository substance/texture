'use strict';

var Subscript = require('./Subscript');
var SubscriptConverter = require('./SubscriptConverter');

module.exports = {
  name: 'subscript',
  configure: function(config) {
    config.addNode(Subscript);
    config.addConverter('jats', SubscriptConverter);
  }
};
