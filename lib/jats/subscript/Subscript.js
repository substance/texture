import { Annotation } from 'substance'

class Subscript extends Annotation {}

Subscript.type = 'subscript'

Subscript.define({
  attributes: { type: 'object', default: {} }
})

export default Subscript
