'use strict';

var DocumentNode = require('substance/model/DocumentNode');
var toDOM = require('../../../util/toDOM');
var extractFullName = require('../../../util/extractFullName');

function extractAffiliations(el) {
  var xrefs = el.findAll('xref[ref-type=aff]');
  var affIds = xrefs.map(xref => xref.getAttribute('rid'));
  return affIds;
}

class Contrib extends DocumentNode {

  /*
    Turns the xmlContent string into JSON, ready to be
    rendered by a component.
  */
  getObject() {
    var el = this.toElement();

    return {
      fullName: extractFullName(el),
      affiliations: extractAffiliations(el)
    };
  }

  /*
    Returns true if node follows strict texture-enforced markup
  */
  isStrict() {
    return this.attributes.generator === 'texture';
  }

  toElement() {
    return toDOM(this);
  }
}

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
  xmlContent: { type: 'string', default: ''}
});

module.exports = Contrib;
