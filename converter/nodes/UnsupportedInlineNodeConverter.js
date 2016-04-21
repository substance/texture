'use strict';

var extend = require('lodash/extend');
var UnsupportedBlockNodeConverter = require('./UnsupportedBlockNodeConverter');

module.exports = extend({}, UnsupportedBlockNodeConverter, {
  type: "unsupported-inline"
});
