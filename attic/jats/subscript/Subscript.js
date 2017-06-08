import { PropertyAnnotation } from 'substance'

class Subscript extends PropertyAnnotation {}

Subscript.type = 'subscript'

Subscript.define({
  attributes: { type: 'object', default: {} }
})

export default Subscript
