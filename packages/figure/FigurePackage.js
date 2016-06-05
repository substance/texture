'use strict';

var Figure = require('./Figure');
var FigureComponent = require('./FigureComponent');
var FigureJATSConverter = require('./FigureJATSConverter');

module.exports = {
  name: 'figure',
  configure: function(config) {
    config.addNode(Figure);
    config.addComponent(Figure.static.name, FigureComponent);
    config.addConverter('jats', FigureJATSConverter);
  }
};