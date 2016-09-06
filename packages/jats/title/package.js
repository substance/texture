'use strict';

var Title = require('./Title');
var TitleConverter = require('./TitleConverter');
var TitleComponent = require('./TitleComponent');

module.exports = {
  name: 'title',
  configure: function(config) {
    config.addNode(Title);
    config.addConverter('jats', TitleConverter);
    config.addComponent(Title.type, TitleComponent);
  }
};
