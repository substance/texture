import { Editing } from 'substance'

/*
  EXPERIMENTAL: an 'Editing' interface that takes the XML schema into account.
  TODO: try to generalize this and add it to the 'app dev kit'
*/
export default class TextureEditing extends Editing {
  /*
    2.0 API suggestion (pass only id, not data)
  */
  insertInlineNode (tx, node) {
    let text = '\uFEFF'
    this.insertText(tx, text)
    let sel = tx.selection
    let endOffset = tx.selection.end.offset
    let startOffset = endOffset - text.length
    // TODO: introduce a coordinate operation for that
    tx.set([node.id, 'start', 'path'], sel.path)
    tx.set([node.id, 'start', 'offset'], startOffset)
    tx.set([node.id, 'end', 'path'], sel.path)
    tx.set([node.id, 'end', 'offset'], endOffset)
    return node
  }

  createListNode (tx, containerPath, params) {
    let prop = tx.getProperty(containerPath)
    if (prop.targetTypes.indexOf('list') >= 0) {
      return tx.create({ type: 'list', listType: params.listType })
    } else {
      throw new Error(`'list' is not a valid child node for ${containerPath}`)
    }
  }

  insertBlockNode (tx, node) {
    // HACK: deviating from the current implementation
    // to replace selected node, because it happens quite often
    let sel = tx.selection
    if (sel.isNodeSelection() && sel.mode !== 'before') {
      tx.setSelection(Object.assign(sel.toJSON(), { mode: 'after' }))
    }
    super.insertBlockNode(tx, node)
  }
}
