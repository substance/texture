'use strict';

var Label = require('./Label');
var LabelConverter = require('./LabelConverter');
var LabelComponent = require('./LabelComponent');

module.exports = {
  name: 'label',
  configure: function(config) {
    config.addNode(Label);
    config.addComponent(Label.static.name, LabelComponent);
    config.addConverter('jats', LabelConverter);
  }
};
