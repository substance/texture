'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Front() {
  Front.super.apply(this, arguments);
}

DocumentNode.extend(Front);

Front.static.name = "front";

/*
  Content
    (
      journal-meta?, article-meta,
      (def-list | list | ack | bio | fn-group | glossary | notes)*
    )
*/

Front.static.defineSchema({
  xmlAttributes: { type: 'object',  default: {} },
  journalMeta: { type: 'id', optional: true },
  articleMeta: { type: 'id' },
  contentNodes: { type: ['id'], default: [] }
});


module.exports = Front;
