'use strict';

var DocumentNode = require('substance/model/DocumentNode');

/*
  ref

  One item in a bibliographic list.
*/
function Ref() {
  Ref.super.apply(this, arguments);
}

DocumentNode.extend(Ref);

Ref.static.name = 'ref';

/*
  Content
  (label?, (citation-alternatives | element-citation | mixed-citation | nlm-citation | note | x)+)
*/
Ref.static.defineSchema({
  attributes: { type: 'object', default: {} },
  label: { type: 'label', optional: true },
  xmlContent: {type: 'string', default: ''}
});

module.exports = Ref;
