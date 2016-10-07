import { Annotation } from 'substance'

class Monospace extends Annotation {}

Monospace.type = 'monospace'

Monospace.define({
  attributes: { type: 'object', default: {} }
})

export default Monospace
