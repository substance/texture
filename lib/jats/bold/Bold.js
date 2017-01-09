import { PropertyAnnotation } from 'substance'

class Bold extends PropertyAnnotation {}

Bold.type = 'bold'

Bold.define({
  attributes: { type: 'object', default: {} }
})

export default Bold
