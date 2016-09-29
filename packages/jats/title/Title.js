import { TextNode } from 'substance'

class Title extends TextNode {}

Title.type = 'title'

Title.define({
  attributes: { type: 'object', default: {} }
})

export default Title
