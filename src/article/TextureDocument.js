import { XMLDocument } from 'substance'
import TextureArticle from './TextureArticle'
import XrefIndex from './XrefIndex'
import TextureEditing from './TextureEditing'
import TextureEditingInterface from './TextureEditingInterface'

export default class TextureDocument extends XMLDocument {

  _initialize() {
    super._initialize()
    // special index for xref lookup
    this.addIndex('xrefs', new XrefIndex())
  }

  getDocTypeParams() {
    return TextureArticle.getDocTypeParams()
  }

  getXMLSchema() {
    return TextureArticle
  }

  getRootNode() {
    return this.get('article')
  }

  getXRefs() {
    let articleEl = this.get('article')
    // this traverses the article in the same way as css-select
    return articleEl.findAll('xref')
  }

  createEditingInterface() {
    return new TextureEditingInterface(this, { editing: new TextureEditing() })
  }

  invert(change) {
    let inverted = change.invert()
    let info = inverted.info || {}
    switch(change.info.action) {
      case 'insertRows': {
        info.action = 'deleteRows'
        break
      }
      case 'deleteRows': {
        info.action = 'insertRows'
        break
      }
      case 'insertCols': {
        info.action = 'deleteCols'
        break
      }
      case 'deleteCols': {
        info.action = 'insertCols'
        break
      }
      default:
        //
    }
    inverted.info = info
    return inverted
  }

}
