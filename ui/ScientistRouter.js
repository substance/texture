'use strict';

var Router = require('substance/ui/Router');

function ScientistRouter(app) {
  Router.call(this);
  this.app = app;
}

ScientistRouter.Prototype = function() {

  // URL helpers
  this.openNote = function(documentId) {
    return '#' + Router.objectToRouteString({
      section: 'note',
      documentId: documentId
    });
  };
};

Router.extend(ScientistRouter);

module.exports = ScientistRouter;