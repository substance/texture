import { Document, documentHelpers, EditingInterface } from 'substance'
import ArticleEditingImpl from './shared/ArticleEditingImpl'

export default class InternalArticleDocument extends Document {
  getRootNode () {
    return this.get('article')
  }

  getXRefs () {
    let articleEl = this.get('article')
    return articleEl.findAll('xref')
  }

  getTitle () {
    return this.get(['article', 'title'])
  }

  createEditingInterface () {
    return new EditingInterface(this, { editing: new ArticleEditingImpl() })
  }

  find (selector) {
    return this.getRootNode().find(selector)
  }

  findAll (selector) {
    return this.getRootNode().findAll(selector)
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
    documentHelpers.createNodeFromJson(doc, {
      type: 'article',
      id: 'article',
      metadata: {
        type: 'metadata',
        id: 'metadata',
        permission: {
          type: 'permission',
          id: 'permission'
        }
      },
      abstract: {
        type: 'abstract',
        id: 'abstract',
        content: [{ type: 'paragraph' }]
      },
      body: {
        type: 'body',
        id: 'body'
      }
    })
    return doc
  }
}
