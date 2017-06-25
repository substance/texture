import { EventEmitter, DefaultDOMElement, validateXMLSchema } from 'substance'
import { JATS, restrictedJATS, TextureJATS } from '../article'
import { r2t } from './r2t'

/*
  Goal:
  - make it very transparent, what exactly gets transformed
  - show what goes wrong

*/
export default class JATSImporter extends EventEmitter {

  import(xml) {
    let dom
    this.emit('begin')

    this.emit('begin:parse')
    try {
      dom = DefaultDOMElement.parseXML(xml)
    } catch(err) {
      this.emit('error:parse', err)
      return
    }
    this.emit('end:parse')

    if (!this._validate(JATS, dom)) return

    // JATS -> restricted JATS
    if (!this._transform('j2r',dom)) return

    if (!this._validate(restrictedJATS, dom)) return

    // restrictedJATS -> TextureJATS
    if (!this._transform('r2t',dom)) return

    if (!this._validate(TextureJATS, dom)) return

    this.emit('end')
  }

  _validate(schema, dom) {
    const name = schema.getName()
    this.emit(`begin:validate-${name}`)
    let res = validateXMLSchema(schema, dom)
    if (res.errors) {
      res.errors.forEach((err) => {
        this.emit(`error:validate-${name}`, err)
      })
      return false
    }
    this.emit(`end:validate-${name}`)
    return true
  }

  _transform(mode, dom) {
    this.emit(`begin:${mode}`)
    if (mode  === 'r2t') {
      // we maintain this as a monolith
      r2t(dom)
    } else {
      // TODO: apply single transformations
    }
    this.emit(`end:${mode}`)
    return true
  }
}