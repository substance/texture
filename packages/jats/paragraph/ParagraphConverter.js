'use strict';

var without = require('lodash/without');
var JATS = require('../JATS');
var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'paragraph',
  tagName: 'p',
});
