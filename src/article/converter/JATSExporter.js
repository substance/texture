import { validateXMLSchema } from 'substance'
import TextureArticle from '../TextureArticle'
import { internal2jats } from './r2t'

export default class JATSExporter {
  /*
    Takes a InternalArticle document as a DOM and transforms it into a JATS document,
    following TextureArticle guidelines.
  */
  export (dom, context = {}) {
    let doc = context.doc
    let session = context.session
    let state = {
      hasErrored: false,
      errors: [],
      dom,
      doc,
      session
    }
    const api = this._createAPI(state)

    internal2jats(dom, api)

    let res = validateXMLSchema(TextureArticle, dom)
    if (!res.ok) {
      res.errors.forEach((err) => {
        console.error(err.msg, err.el)
      })
    }

    return state
  }

  _createAPI (state) {
    const self = this
    let api = {
      error (data) {
        self._error(state, data)
      },
      doc: state.doc,
      session: state.session
    }
    return api
  }

  _error (state, err) {
    state.hasErrored = true
    state.errors.push(err)
  }
}
