'use strict';

var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'paragraph',
  tagName: 'p',
});
