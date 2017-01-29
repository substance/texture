import { PropertyAnnotation } from 'substance'

class Monospace extends PropertyAnnotation {}

Monospace.type = 'monospace'

Monospace.define({
  attributes: { type: 'object', default: {} }
})

export default Monospace
