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
  xmlAttributes: { type: 'object', default: {} },
  title: { type: 'text' }
});

module.exports = Caption;