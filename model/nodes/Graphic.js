'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Graphic() {
  Graphic.super.apply(this, arguments);
}

DocumentNode.extend(Graphic);

Graphic.static.name = 'graphic';

Graphic.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  href: { type: 'string', default: '' }
});

module.exports = Graphic;