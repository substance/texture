'use strict';

var Container = require('substance/model/Container');

function Body() {
  Body.super.apply(this, arguments);
}

Container.extend(Body);

Body.static.name = "body";

module.exports = Body;
