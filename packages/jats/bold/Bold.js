import { Annotation } from 'substance'

class Bold extends Annotation {}

Bold.type = 'bold'

Bold.define({
  attributes: { type: 'object', default: {} }
})

export default Bold
