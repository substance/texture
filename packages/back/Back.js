'use strict';

var Container = require('substance/model/Container');

/*
  Back matter

  Material published with an article but following the narrative flow.
*/
function Back() {
  Back.super.apply(this, arguments);
}

Container.extend(Back);

Back.static.name = 'back';

/*
  Content
  (label?, title*, (ack | app-group | bio | fn-group | glossary | ref-list | notes | sec)*)
*/

// TODO: title* currently not supported

Back.static.defineSchema({
  label: { type: 'string', optional:true },
  xmlAttributes: { type: 'object', default: {} },
  // inherits 'nodes' from Container
});

module.exports = Back;
