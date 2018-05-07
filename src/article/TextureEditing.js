import { Editing, validateXMLSchema, isString, paste } from 'substance'
import TextureArticleSchema from './TextureArticle'

/*
  Proposal for Substance 2.0 XMLEditing implementation
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
  paste(tx, content) {
    if (!content) return
    /* istanbul ignore else  */
    if (isString(content)) {
      paste(tx, {text: content})
    } else if (content._isDocument) {
      paste(tx, { doc: content })
    } else {
      throw new Error('Illegal content for paste.')
    }

    let res = validateXMLSchema(TextureArticleSchema, tx.getDocument().toXML())
    if (!res.ok) {
      res.errors.forEach((err) => {
        console.error(err.msg, err.el)
      })
      throw new Error('Paste is violating the schema')
    }
  }

  /*
    2.0 API suggestion (pass only id, not data)
  */
  insertInlineNode(tx, node) {
    let sel = tx.selection
    let text = "\uFEFF"
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

  createTextNode(tx, container, text) {
    let parentType = container.type
    let schema = TextureArticleSchema.getElementSchema(parentType)
    if (schema.isAllowed('p')) {
      return tx.create({ type: 'p', content: text })
    } else {
      throw new Error(`FIXME: which default element should be used in <${parentType}>`)
    }
  }

  createListNode(tx, container, params) {
    let parentType = container.type
    let schema = TextureArticleSchema.getElementSchema(parentType)
    if (schema.isAllowed('list')) {
      let el = tx.create({ type: 'list' })
      if (params.ordered) {
        el.attr('type', 'ordered')
      } else {
        el.attr('type', 'unordered')
      }
      return el
    } else {
      throw new Error(`<list> is not allowed in <${parentType}>`)
    }
  }

}
