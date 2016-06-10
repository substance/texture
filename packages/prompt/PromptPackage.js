'use strict';

var Prompt = require('./Prompt');

module.exports = {
  name: 'prompt',
  configure: function(config) {
    config.addComponent('prompt', Prompt);
  }
};