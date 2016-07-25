'use strict';

var UnsupportedNodeJATSConverter = require('./UnsupportedNodeJATSConverter');

module.exports = {

  type: 'unsupported-inline',

  matchElement: function() {
    return true;
  },

  import: UnsupportedNodeJATSConverter.import,
  export: UnsupportedNodeJATSConverter.export
};
