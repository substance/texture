import { TextNode } from 'substance'

class Label extends TextNode {}

Label.type = 'label'

Label.define({
  attributes: { type: 'object', default: {} }
})

export default Label
