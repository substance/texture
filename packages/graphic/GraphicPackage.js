'use strict';

var Graphic = require('./Graphic');
var GraphicComponent = require('./GraphicComponent');
var GraphicJATSConverter = require('./GraphicJATSConverter');

module.exports = {
  name: 'graphic',
  configure: function(config) {
    config.addNode(Graphic);
    config.addComponent(Graphic.static.name, GraphicComponent);
    config.addConverter('jats', GraphicJATSConverter);
  }
};