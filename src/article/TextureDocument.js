import { XMLDocument } from 'substance'
import TextureJATS from './TextureJATS'
import XrefIndex from './XrefIndex'

export default
class JATSDocument extends XMLDocument {

  _initialize() {
    super._initialize()
    // special index for xref lookup
    this.addIndex('xrefs', new XrefIndex())
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
