import DefaultModel from './DefaultModel'
import { getXrefLabel } from '../../editor/util/xrefHelpers'

export default class FootnotesModel extends DefaultModel {
  getLabel(id) {
    let doc = this.context.doc
    let fn = doc.get(id)
    return getXrefLabel(fn)
  }

  /*
    Render footnote as HTML
  */
  renderFootnote(id) {
    const node = this._node.find('#'+id)
    const content = node.getContent()
    let html = content.map(pId => `<p>${this._node.find('#'+pId).getText()}</p>`)
    return html
  }
}
