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

Graphic.type= 'graphic';

Graphic.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Graphic;