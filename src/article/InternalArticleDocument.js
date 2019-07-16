import { Document, documentHelpers, EditingInterface } from 'substance'
import ArticleEditingImpl from './shared/ArticleEditingImpl'
import { DEFAULT_JATS_SCHEMA_ID } from './ArticleConstants'

export default class InternalArticleDocument extends Document {
  getRootNode () {
    return this.get('article')
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

  getTitle () {
    this.resolve(['article', 'title'])
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

  // Overridden to retain the original docType
  newInstance () {
    let doc = super.newInstance()
    doc.docType = this.docType
    return doc
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
    doc.docType = DEFAULT_JATS_SCHEMA_ID
    return doc
  }
}
