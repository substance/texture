'use strict';

var Label = require('./Label');
var LabelConverter = require('./LabelConverter');

module.exports = {
  name: 'label',
  configure: function(config) {
    config.addNode(Label);
    config.addConverter('jats', LabelConverter);
  }
};
