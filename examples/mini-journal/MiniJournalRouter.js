'use strict';

var Router = require('substance/ui/Router');

function ScientistRouter(app) {
  Router.apply(this, arguments);
  this.app = app;
}

ScientistRouter.Prototype = function() {

};

Router.extend(ScientistRouter);

module.exports = ScientistRouter;