import { Container } from 'substance'

class Footnote extends Container {}

Footnote.type = 'footnote'

/*
  Content
    (label?, p+)
*/
Footnote.define({
  attributes: { type: 'object', default: {} },
  label: { type: 'label', optional: true },
  nodes: { type: ['p'], default: [] }
})

export default Footnote
