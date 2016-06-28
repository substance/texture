'use strict';

var Container = require('substance/model/Container');

function Graphic() {
  Graphic.super.apply(this, arguments);
}

Graphic.Prototype = function() {

  this.getHref = function() {
    return this.attributes['xlink:href'];
  };

};

Container.extend(Graphic);

Graphic.static.name = 'graphic';

Graphic.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Graphic;