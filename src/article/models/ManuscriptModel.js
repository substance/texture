import { createValueModel } from '../../kit'

/**
 * A view on parts of an Article used for the manuscript view.
 */
export default class ManuscriptModel {
  constructor (api, doc) {
    this._title = createValueModel(api, ['article', 'title'])
    this._abstract = createValueModel(api, ['article', 'abstract'])
    this._authors = createValueModel(api, ['metadata', 'authors'])
    this._body = createValueModel(api, ['body', 'content'])
    this._footnotes = createValueModel(api, ['article', 'footnotes'])
    this._references = createValueModel(api, ['article', 'references'])
  }

  getAbstract () {
    return this._abstract
  }

  getAuthors () {
    return this._authors
  }

  hasAuthors () {
    return this._authors.length > 0
  }

  getBody () {
    return this._body
  }

  getFootnotes () {
    return this._footnotes
  }

  hasFootnotes () {
    return this._footnotes.length > 0
  }

  getReferences () {
    return this._references
  }

  hasReferences () {
    return this._references.length > 0
  }

  getTitle () {
    return this._title
  }
}
