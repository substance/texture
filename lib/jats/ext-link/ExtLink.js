import { PropertyAnnotation, Fragmenter } from 'substance'

class ExtLink extends PropertyAnnotation {}

ExtLink.type = 'ext-link'

ExtLink.define({
  attributes: {
    type: 'object', default: {'xlink:href': ''}
  }
})

// in presence of overlapping annotations will try to render this as one element
ExtLink.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default ExtLink
