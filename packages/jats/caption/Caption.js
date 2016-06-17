'use strict';

var Container = require('substance/model/Container');

function Caption() {
  Caption.super.apply(this, arguments);
}

Container.extend(Caption);

Caption.static.name = 'caption';

/*
  Content
    ( title?, (p)* )
*/
Caption.static.defineSchema({
  attributes: { type: 'object',  default: {} },
  title: { type: 'title', optional: true },
  nodes: { type: ['p'], default: [] }
});

module.exports = Caption;