import { Annotation } from 'substance'

class Italic extends Annotation {}

Italic.type = 'italic'

Italic.define({
  attributes: { type: 'object', default: {} }
})

export default Italic
