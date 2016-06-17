'use strict';

var JATS = require('../JATS');
var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'label',
  tagName: 'label',
  canContain: JATS.ALL_PHRASE.concat(JATS.BREAK)
});
