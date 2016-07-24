'use strict';

var Graphic = require('./Graphic');
var GraphicComponent = require('./GraphicComponent');
var GraphicConverter = require('./GraphicConverter');

module.exports = {
  name: 'graphic',
  configure: function(config) {
    config.addNode(Graphic);
    config.addComponent(Graphic.type, GraphicComponent);
    config.addConverter('jats', GraphicConverter);
    config.addStyle(__dirname, '_graphic.scss');
  }
};