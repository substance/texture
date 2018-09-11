import { DefaultDOMElement } from 'substance'
import createJatsImporter from './converter/r2t/createJatsImporter'
import { FIGURE_SNIPPET, FOOTNOTE_SNIPPET, TABLE_SNIPPET } from './ArticleSnippets'
const elementSpippetsMap = {
  'figure': FIGURE_SNIPPET,
  'footnote': FOOTNOTE_SNIPPET,
  'table-figure': TABLE_SNIPPET
}

export function createEmptyElement (tx, elName) {
  const snippet = elementSpippetsMap[elName]
  if (!snippet) {
    throw new Error('There is no snippet for element', elName)
  }
  let snippetEl = DefaultDOMElement.parseSnippet(snippet.trim(), 'xml')
  let jatsImporter = createJatsImporter(tx)
  return jatsImporter.convertElement(snippetEl)
}
