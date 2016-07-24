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

Ref.type = 'ref';

/*
  Content
  (label?, (citation-alternatives | element-citation | mixed-citation | nlm-citation | note | x)+)
*/
Ref.define({
  attributes: { type: 'object', default: {} },
  xmlContent: {type: 'string', default: ''}
});

module.exports = Ref;
