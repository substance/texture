import { EventEmitter, DefaultDOMElement, validateXMLSchema, isString } from 'substance'
import { JATS, JATS4R, TextureJATS } from '../article'
import { r2t } from './r2t'
import { j2r } from './j2r'

/*
  Goal:
  - make it very transparent, what exactly gets transformed
  - show what goes wrong

*/
export default class JATSImporter extends EventEmitter {

  import(xml) {
    let dom

    this.errors = {
      'parse': [],
      'validate-jats': [],
      'validate-jats4r': [],
      'validate-texture-jats': [],
      'j2r': [],
      'r2t': []
    }

    if (isString(xml)) {
      try {
        dom = DefaultDOMElement.parseXML(xml)
      } catch(err) {
        this._error('parse', {
          msg: String(err)
        })
        return
      }
    } else if (xml._isDOMElement) {
      dom = xml
    }

    if (!this._validate(JATS, dom)) return dom

    // JATS -> restricted JATS
    if (!this._transform('j2r',dom)) return dom

    if (!this._validate(JATS4R, dom)) return dom

    // restrictedJATS -> TextureJATS
    if (!this._transform('r2t',dom)) return dom

    if (!this._validate(TextureJATS, dom)) return dom

    return dom
  }

  hasErrored() {
    return this._hasErrored
  }

  _validate(schema, dom) {
    const name = schema.getName()
    const channel = `validate-${name}`
    let res = validateXMLSchema(schema, dom)
    if (!res.ok) {
      res.errors.forEach((err) => {
        this._error(channel, err)
      })
      return false
    }
    return true
  }

  _transform(mode, dom) {
    const api = this._createAPI(dom, mode)
    switch (mode) {
      case 'j2r':
        j2r(dom, api)
        break
      case 'r2t':
        r2t(dom, api)
        break
      default:
        //
    }
    return true
  }

  _createAPI(dom, channel) {
    const self = this
    let api = {
      error(data) {
        self._error(channel, data)
      }
    }
    return api
  }

  _error(channel, err) {
    this._hasErrored = true
    this.errors[channel].push(err)
  }

}
