import { XMLDocument } from 'substance'
import TextureJATS from './TextureJATS'
import XrefIndex from './XrefIndex'

export default class TextureDocument extends XMLDocument {

  _initialize() {
    super._initialize()
    // special index for xref lookup
    this.addIndex('xrefs', new XrefIndex())
  }

  getDocTypeParams() {
    return ['article', 'TextureJATS 1.1', 'http://texture.substance.io/TextureJATS-1.1.dtd']
  }

  getXMLSchema() {
    return TextureJATS
  }

  getRootNode() {
    return this.get('article')
  }

  getXRefs() {
    let articleEl = this.get('article')
    // this traverses the article in the same way as css-select
    return articleEl.findAll('xref')
  }
}
