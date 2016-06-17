'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Graphic() {
  Graphic.super.apply(this, arguments);
}

DocumentNode.extend(Graphic);

Graphic.static.name = 'graphic';

Graphic.static.defineSchema({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

module.exports = Graphic;