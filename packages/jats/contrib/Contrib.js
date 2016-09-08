'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Contrib() {
  Contrib.super.apply(this, arguments);
}

DocumentNode.extend(Contrib);

Contrib.type = 'contrib';

/*
  Content
  (
    (
      anonymous | collab | name | name-alternatives | string-name | degrees |
      address | aff | aff-alternatives | author-comment | bio | email | etal | ext-link |
      fn | on-behalf-of | role | uri | xref | x
    )*
  )
*/
Contrib.define({
  attributes: { type: 'object', default: {} },
  xmlContent: { type: 'string', default: ''}// ,
  // tagName: 'string'
});

module.exports = Contrib;
