'use strict';

var Title = require('./Title');
var TitleConverter = require('./TitleConverter');

module.exports = {
  name: 'title',
  configure: function(config) {
    config.addNode(Title);
    config.addConverter('jats', TitleConverter);
  }
};
