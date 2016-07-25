'use strict';

module.exports = {
  name: 'common',
  configure: function(config) {
    config.addStyle(__dirname, '_isolated-node.scss');
    config.addStyle(__dirname, '_edit-xml.scss');
  }
};