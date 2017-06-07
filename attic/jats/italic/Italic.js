import { PropertyAnnotation } from 'substance'

class Italic extends PropertyAnnotation {}

Italic.type = 'italic'

Italic.define({
  attributes: { type: 'object', default: {} }
})

export default Italic
