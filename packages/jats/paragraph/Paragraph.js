import { TextBlock } from 'substance'

class ParagraphNode extends TextBlock {}

ParagraphNode.type = "paragraph"

ParagraphNode.define({
  attributes: { type: 'object', default: {} }
})

export default ParagraphNode
