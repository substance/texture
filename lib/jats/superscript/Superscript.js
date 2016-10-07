import { Annotation } from 'substance'

class Superscript extends Annotation {}

Superscript.type = 'superscript'

Superscript.define({
  attributes: { type: 'object', default: {} }
})

export default Superscript
