'use strict';

var Caption = require('./Caption');
var CaptionComponent = require('./CaptionComponent');
var CaptionConverter = require('./CaptionConverter');

module.exports = {
  name: 'caption',
  configure: function(config) {
    config.addNode(Caption);
    config.addComponent(Caption.type, CaptionComponent);
    config.addConverter('jats', CaptionConverter);
  }
};