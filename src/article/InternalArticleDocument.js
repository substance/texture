import { XMLDocument } from 'substance'
import XrefIndex from './XrefIndex'
import TextureEditing from './TextureEditing'
import TextureEditingInterface from './TextureEditingInterface'

// TODO: it would be better to use a general document implementation (like XMLDocument)
// and come up with a new mechanism to bind indexes to the document instance
// Helpers like findByType and such can be achieved differently
export default class InternalArticleDocument extends XMLDocument {
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

  find () {
    console.error('FIXME: InternalArticleDocument should implement find()')
  }

  findAll () {
    console.error('FIXME: InternalArticleDocument should implement findAll()')
    return []
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
    $$('article').append(
      $$('metadata').append(
        $$('article-record'),
        $$('authors'),
        $$('editors'),
        $$('groups'),
        $$('affiliations'),
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
