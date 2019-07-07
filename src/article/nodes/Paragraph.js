import { TextNode, TEXT } from 'substance'
import { RICH_TEXT_ANNOS, EXTENDED_FORMATTING, LINKS_AND_XREFS, INLINE_NODES } from './modelConstants'

export default class Paragraph extends TextNode {}
Paragraph.schema = {
  type: 'paragraph',
  content: TEXT(RICH_TEXT_ANNOS.concat(EXTENDED_FORMATTING).concat(LINKS_AND_XREFS).concat(INLINE_NODES))
}
