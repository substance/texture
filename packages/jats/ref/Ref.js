'use strict';

import { DocumentNode, DefaultDOMElement as DOMElement } from 'substance'

/*
  ref

  One item in a bibliographic list.
*/
function Ref() {
  Ref.super.apply(this, arguments);
}

Ref.Prototype = function() {
  /*
    Checks if ref is a plain text citation, with no formatting / tagging etc.
  */
  this.isPlain = function() {
    // TODO:
  };

  /*
    Get parsed DOM version of XML content
  */
  this.getDOM = function() {
    return DOMElement.parseXML(this.xmlContent);
  };

};


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

export default Ref;
