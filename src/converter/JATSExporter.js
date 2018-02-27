import { t2r } from './r2t'
import { validateXMLSchema } from 'substance'
import { DarArticle } from '../article'

export default class JATSExporter {
  /*
    Takes a TextureJATS document as a DOM and transforms it into a JATS document,
    following DarArticle guidelines.
  */
  export(dom, context = {}) {
    let pubMetaDb = context.pubMetaDb
    let doc = context.doc

    if (!pubMetaDb) {
      throw new Error('context.pubMetaDb is missing')
    }

    let state = {
      hasErrored: false,
      errors: [],
      dom,
      doc,
      pubMetaDb
    }
    const api = this._createAPI(state)

    t2r(dom, api)
    let res = validateXMLSchema(DarArticle, dom)
    if (!res.ok) {
      res.errors.forEach((err) => {
        console.error(err.msg, err.el)
      })
    }

    return state
  }

  _createAPI(state) {
    const self = this
    let api = {
      error(data) {
        self._error(state, data)
      },
      pubMetaDb: state.pubMetaDb,
      doc: state.doc
    }
    return api
  }

  _error(state, err) {
    state.hasErrored = true
    state.errors.push(err)
  }

}
