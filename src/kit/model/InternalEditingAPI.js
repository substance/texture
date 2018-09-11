import { Editing, isString, paste, copySelection } from 'substance'

export default class InternalEditingAPI extends Editing {
  copySelection (tx) {
    copySelection(tx, tx.selection)
  }

  createTextNode (tx, container, text) {
    throw new Error('This method is abstract')
  }

  createListNode (tx, container, params) {
    throw new Error('This method is abstract')
  }

  insertInlineNode (tx, node) {
    let sel = tx.selection
    let text = '\uFEFF'
    this.insertText(tx, text)
    sel = tx.selection
    let endOffset = tx.selection.end.offset
    let startOffset = endOffset - text.length
    // TODO: introduce a coordinate operation for that
    tx.set([node.id, 'start', 'path'], sel.path)
    tx.set([node.id, 'start', 'offset'], startOffset)
    tx.set([node.id, 'end', 'path'], sel.path)
    tx.set([node.id, 'end', 'offset'], endOffset)
    return node
  }

  paste (tx, content) {
    if (!content) return
    if (isString(content)) {
      paste(tx, {text: content})
    } else if (content._isDocument) {
      paste(tx, { doc: content })
    } else {
      throw new Error('Illegal content for paste.')
    }
  }
}
