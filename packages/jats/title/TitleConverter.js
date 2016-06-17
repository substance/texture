'use strict';

var JATS = require('../JATS');
var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'title',
  tagName: 'title',
  canContain: JATS.ALL_PHRASE
    .concat(JATS.BREAK)
    .concat(JATS.CITATION),
});
