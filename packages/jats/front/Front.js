import { Container } from 'substance'

class Front extends Container {}

Front.type = "front"

/*
  Content
    (
      journal-meta?, article-meta,
      (def-list | list | ack | bio | fn-group | glossary | notes)*
    )
*/

Front.define({
  attributes: { type: 'object', default: {} },
  journalMeta: { type: 'journal-meta', optional: true },
  articleMeta: { type: 'article-meta' },
  nodes: { type: ['id'], default: [] }
})

export default Front
