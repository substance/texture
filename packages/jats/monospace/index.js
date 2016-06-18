'use strict';

var Monospace = require('./Monospace');
var MonospaceConverter = require('./MonospaceConverter');

module.exports = {
  name: 'monospace',
  configure: function(config) {
    config.addNode(Monospace);
    config.addConverter('jats', MonospaceConverter);
  }
};
