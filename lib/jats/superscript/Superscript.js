import { PropertyAnnotation } from 'substance'

class Superscript extends PropertyAnnotation {}

Superscript.type = 'superscript'

Superscript.define({
  attributes: { type: 'object', default: {} }
})

export default Superscript
