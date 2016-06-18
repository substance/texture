'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Graphic() {
  Graphic.super.apply(this, arguments);
}

Graphic.Prototype = function() {

  this.getHref = function() {
    return this.attributes['xlink:href'];
  };

};

DocumentNode.extend(Graphic);

Graphic.static.name = 'graphic';

Graphic.static.defineSchema({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

module.exports = Graphic;