'use strict';

var without = require('lodash/without');
var JATS = require('../JATS');
var TextNodeConverter = require('../TextNodeConverter');

var P_ELEMENTS = without(
  JATS.ALL_PHRASE
    .concat(JATS.BLOCK_DISPLAY)
    .concat(JATS.BLOCK_MATH)
    .concat(JATS.CITATION)
    .concat(JATS.FUNDING)
    .concat(JATS.LIST)
    .concat(JATS.REST_OF_PARA),
  'alternatives'
);

module.exports = TextNodeConverter.extend({
  type: 'paragraph',
  tagName: 'p',
  canContain: P_ELEMENTS
});
