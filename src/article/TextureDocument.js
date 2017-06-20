import { XMLDocument } from 'substance'
import TextureJATS from './TextureJATS'

export default
class JATSDocument extends XMLDocument {

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
