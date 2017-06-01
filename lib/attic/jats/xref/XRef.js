'use strict';

import { Fragmenter, InlineNode } from 'substance'

class XRef extends InlineNode {}

XRef.type = 'xref';

XRef.schema = {
  attributes: { type: 'object', default: {} },
  targets: {type: ['id'], default: []},
  label: { type: 'text', optional: true }
}

Object.defineProperties(XRef.prototype, {
  referenceType: {
    get: function() {
      return this.attributes['ref-type']
    },
    set: function(refType) {
      this.attributes['ref-type'] = refType
    }
  }
})

// In presence of overlapping annotations will try to render this as one element
XRef.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default XRef
