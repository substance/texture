import { Editing, isString, paste } from 'substance'

/*
  EXPERIMENTAL: an 'Editing' interface that takes the XML schema into account.
  TODO: try to generalize this and add it to the 'app dev kit'
*/
export default class TextureEditing extends Editing {
  // EXPERIMENTAL: run validation after pasting
  // and throw if there are errors
  // We need to find out which is the best way regarding schema
  // strictness
  // While it would be fantastic to be 100% strict all the time
  // it could also be a way to introduce an issue system
  // and instead failing badly, just make the user aware of these
  // issues
  // TODO: in general we would need to 'pre-process'
  paste (tx, content) {
    if (!content) return
    /* istanbul ignore else  */
    if (isString(content)) {
      paste(tx, {text: content})
    } else if (content._isDocument) {
      paste(tx, { doc: content })
    } else {
      throw new Error('Illegal content for paste.')
    }

    // FIXME: revisit on-the-fly validation
    // let res = validateXMLSchema(InternalArticleSchema, tx.getDocument().toXML())
    // if (!res.ok) {
    //   res.errors.forEach((err) => {
    //     console.error(err.msg, err.el)
    //   })
    //   throw new Error('Paste is violating the schema')
    // }
  }

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

  createTextNode (tx, container, text) {
    // FIXME: FIXME: bring back schema compliant tx.createTextNode()
    // let parentType = container.type
    // TODO: revisit on-the-fly schema check
    // let schema = InternalArticleSchema.getElementSchema(parentType)
    // if (schema.isAllowed('p')) {
    //   return tx.create({ type: 'p', content: text })
    // } else {
    //   throw new Error(`FIXME: which default element should be used in <${parentType}>`)
    // }
    return tx.create({ type: 'p', content: text })
  }

  createListNode (tx, container, params) {
    // FIXME: bring back schema compliant tx.createTextNode()
    // let parentType = container.type
    // let schema = InternalArticleSchema.getElementSchema(parentType)
    // if (schema.isAllowed('list')) {
    //   let el = tx.create({ type: 'list' })
    //   if (params.listType) {
    //     el.attr('list-type', params.listType)
    //   }
    //   return el
    // } else {
    //   throw new Error(`<list> is not allowed in <${parentType}>`)
    // }
    let el = tx.create({ type: 'list' })
    if (params.listType) {
      el.attr('list-type', params.listType)
    }
    return el
  }
}
