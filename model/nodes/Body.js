'use strict';

var Container = require('substance/model/Container');

function Body() {
  Body.super.apply(this, arguments);
}

Container.extend(Body);

Body.static.name = "body";
Body.static.allowedContext = "article";

module.exports = Body;
