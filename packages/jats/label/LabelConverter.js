'use strict';

var TextNodeConverter = require('../TextNodeConverter');

module.exports = TextNodeConverter.extend({
  type: 'label',
  tagName: 'label',
});
