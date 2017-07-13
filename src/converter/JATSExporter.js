import { t2r } from './r2t'

export default class JATSExporter {
  /*
    Takes a TextureJATS document as a DOM and transforms it into a JATS document,
    following JATS4R guidelines.
  */
  export(dom) {
    const api = this._createAPI(dom)
    t2r(dom, api)
    return dom
  }

  hasErrored() {
    return this._hasErrored
  }

  _createAPI() {
    const self = this
    let api = {
      error(data) {
        self._error(data)
      }
    }
    return api
  }

  _error(err) {
    this._hasErrored = true
    this.errors.push(err)
  }

}
