import {
  EventEmitter, DefaultDOMElement,
  validateXMLSchema, isString
} from 'substance'
import { JATS, JATS4R, TextureJATS } from '../article'
import { r2t } from './r2t'
import { j2r } from './j2r'
import custom from './custom'

import { createEntityDbSession } from '../entities'

/*
  Goal:
  - make it very transparent, what exactly gets transformed
  - show what goes wrong

*/
export default class JATSImporter extends EventEmitter {

  import(xml, context = {}) {
    let entityDb = context.entityDb
    if (!entityDb) {
      entityDb = createEntityDbSession().getDocument()
    }

    let state = {
      dom: null,
      errors: {
        'parse': [],
        'validate-jats': [],
        'custom': [],
        'j2r': [],
        'validate-jats4r': [],
        'r2t': [],
        'validate-texture-jats': [],
      },
      hasErrored: false,
      entityDb
    }

    if (isString(xml)) {
      try {
        state.dom = DefaultDOMElement.parseXML(xml)
      } catch(err) {
        this._error(state, 'parse', {
          msg: String(err)
        })
        return
      }
    } else if (xml._isDOMElement) {
      state.dom = xml
    }

    if (!this._validate(JATS, state)) return state

    // Custom transformations
    if (!this._transform('custom', state)) return state

    // JATS -> restricted JATS
    if (!this._transform('j2r', state)) return state

    if (!this._validate(JATS4R, state)) return state

    // restrictedJATS -> TextureJATS
    if (!this._transform('r2t', state)) return state

    if (!this._validate(TextureJATS, state)) return state

    return state
  }

  _validate(schema, state) {
    const name = schema.getName()
    const channel = `validate-${name}`
    let res = validateXMLSchema(schema, state.dom)
    if (!res.ok) {
      res.errors.forEach((err) => {
        this._error(state, channel, err)
      })
      return false
    }
    return true
  }

  _transform(mode, state) {
    const api = this._createAPI(state, mode)
    let dom = state.dom
    switch (mode) {
      case 'j2r':
        j2r(dom, api)
        break
      case 'r2t':
        r2t(dom, api)
        break
      case 'custom':
        custom.import(dom, api)
        break
      default:
        //
    }
    return true
  }

  _createAPI(state, channel) {
    const self = this
    let api = {
      entityDb: state.entityDb,
      error(data) {
        self._error(state, channel, data)
      }
    }
    return api
  }

  _error(state, channel, err) {
    state.hasErrored = true
    state.errors[channel].push(err)
  }

}
