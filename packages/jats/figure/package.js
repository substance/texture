'use strict';

var Figure = require('./Figure');
var FigureComponent = require('./FigureComponent');
var FigureTarget = require('./FigureTarget');
var FigureConverter = require('./FigureConverter');

module.exports = {
  name: 'figure',
  configure: function(config) {
    config.addNode(Figure);
    config.addComponent(Figure.static.name, FigureComponent);
    config.addComponent(Figure.static.name+'-target', FigureTarget);
    config.addConverter('jats', FigureConverter);
  }
};