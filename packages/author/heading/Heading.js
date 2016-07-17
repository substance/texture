import TextBlock from 'substance/model/TextBlock'

class HeadingNode extends TextBlock {}

HeadingNode.static.name = "heading"

HeadingNode.static.defineSchema({
  // just a reference to the original node
  // which will be used to retain XML attributes
  sectionId: { type: 'id', optional: true },
  level: { type: "number", default: 1 },
})

export default HeadingNode
