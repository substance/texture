'use strict';

var Container = require('substance/model/Container');

function Front() {
  Front.super.apply(this, arguments);
}

Container.extend(Front);

Front.static.name = "front";

/*
  Content
    (
      journal-meta?, article-meta,
      (def-list | list | ack | bio | fn-group | glossary | notes)*
    )
*/

Front.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  journalMeta: { type: 'id', optional: true },
  articleMeta: { type: 'id' },
  // container
  nodes: { type: ['id'], default: [] }
});

module.exports = Front;
