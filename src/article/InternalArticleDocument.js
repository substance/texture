import { Document } from 'substance'
import XrefIndex from './XrefIndex'
import TextureEditing from './TextureEditing'
import TextureEditingInterface from './TextureEditingInterface'

// TODO: it would be better to use a general document implementation (like XMLDocument)
// and come up with a new mechanism to bind indexes to the document instance
// Helpers like findByType and such can be achieved differently
export default class InternalArticleDocument extends Document {
  _initialize () {
    super._initialize()

    // special index for xref lookup
    this.addIndex('xrefs', new XrefIndex())
  }

  getRootNode () {
    return this.get('article')
  }

  getXRefs () {
    let articleEl = this.get('article')
    return articleEl.findAll('xref')
  }

  createEditingInterface () {
    return new TextureEditingInterface(this, { editing: new TextureEditing() })
  }

  createElement (type, data) {
    let nodeData = Object.assign({
      type
    }, data)
    return this.create(nodeData)
  }

  find (selector) {
    return this.get('article').find(selector)
  }

  findAll (selector) {
    return this.get('article').findAll(selector)
  }

  invert (change) {
    let inverted = change.invert()
    let info = inverted.info || {}
    switch (change.info.action) {
      case 'insertRows': {
        info.action = 'deleteRows'
        break
      }
      case 'deleteRows': {
        info.action = 'insertRows'
        break
      }
      case 'insertCols': {
        info.action = 'deleteCols'
        break
      }
      case 'deleteCols': {
        info.action = 'insertCols'
        break
      }
      default:
        //
    }
    inverted.info = info
    return inverted
  }

  static createEmptyArticle (schema) {
    let doc = new InternalArticleDocument(schema)
    const $$ = (type, id) => {
      if (!id) id = type
      return doc.create({type, id})
    }

    let permission = doc.create({ type: 'permission', id: 'article-permission' })
    let articleRecord = doc.create({ type: 'article-record', id: 'article-record', permission: permission.id })

    $$('article').append(
      $$('metadata').append(
        articleRecord,
        $$('authors'),
        $$('editors'),
        $$('groups'),
        $$('organisations'),
        $$('awards'),
        $$('keywords'),
        $$('subjects')
      ),
      $$('content').append(
        $$('front').append(
          $$('title'),
          $$('abstract')
        ),
        $$('body'),
        $$('back').append(
          $$('references'),
          $$('footnotes')
        )
      )
    )
    return doc
  }
}
