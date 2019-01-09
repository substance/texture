import { DocumentNode, TextNodeMixin, TEXT } from 'substance'
import { RICH_TEXT_ANNOS, EXTENDED_FORMATTING, LINKS_AND_XREFS, INLINE_NODES } from './modelConstants'

export default class ListItem extends TextNodeMixin(DocumentNode) {
  getLevel () {
    return this.level
  }

  setLevel (newLevel) {
    let doc = this.getDocument()
    doc.set([this.id, 'level'], newLevel)
  }

  getPath () {
    return [this.id, 'content']
  }

  static isListItem () {
    return true
  }
}

ListItem.schema = {
  type: 'list-item',
  level: { type: 'number', default: 1 },
  content: TEXT(RICH_TEXT_ANNOS.concat(EXTENDED_FORMATTING).concat(LINKS_AND_XREFS).concat(INLINE_NODES))
}
