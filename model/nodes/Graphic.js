'use strict';

// TODO: we should be able to inherit from JATSNode to share xmlAttributes properties.
var BlockNode = require('substance/model/BlockNode');

function Graphic() {
  Graphic.super.apply(this, arguments);
}

BlockNode.extend(Graphic);

Graphic.static.name = 'graphic';
Graphic.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  href: { type: 'string', default: '' }
});

module.exports = Graphic;