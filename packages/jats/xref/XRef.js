import InlineNode from 'substance/model/InlineNode'
import Fragmenter from 'substance/model/Fragmenter'

class XRef extends InlineNode {
  get referenceType() {
    return this.attributes['ref-type']
  }
}

XRef.type = 'xref'

XRef.defineSchema({
  attributes: { type: 'object', default: {} },
  targets: {type: ['id'], default: []},
  label: { type: 'text', optional: true }
});

// In presence of overlapping annotations will try to render this as one element

XRef.fragmentation = Fragmenter.SHOULD_NOT_SPLIT


export default XRef
