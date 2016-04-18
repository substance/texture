'use strict';

var Container = require('substance/model/Container');

function Front() {
  Front.super.apply(this, arguments);
}

Container.extend(Front);

Front.static.name = "front";
Front.static.allowedContext = "article";

module.exports = Front;
