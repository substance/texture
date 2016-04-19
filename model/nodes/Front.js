'use strict';

var Container = require('substance/model/Container');

function Front() {
  Front.super.apply(this, arguments);
}

Container.extend(Front);

Front.static.name = "front";
Front.static.allowedContext = "article";

/*
  Attributes
    id Document Internal Identifier
    xml:base Base
  Content
    (
      journal-meta?, article-meta,
      (def-list | list | ack | bio | fn-group | glossary | notes)*
    )
*/

Front.static.defineSchema({
  journalMeta: { type: 'id', optional:true },
  articleMeta: { type: 'id' }
});


module.exports = Front;
