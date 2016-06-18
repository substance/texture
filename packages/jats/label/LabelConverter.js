'use strict';

var JATS = require('../JATS');
var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'label',
  tagName: 'label',
});
