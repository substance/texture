import { EditingInterface } from 'substance'

/*
  Proposal for Substance 2.0 XMLEditingInterface
*/
export default class TextureEditingInterface extends EditingInterface {

  find(cssSelector) {
    return this.getDocument().find(cssSelector)
  }

  findAll(cssSelector) {
    return this.getDocument().findAll(cssSelector)
  }

  createElement(...args) {
    return this.getDocument().createElement(...args)
  }

  /*
    2.0 API suggestion (pass only id, not data)
  */
  insertBlockNode(nodeId) {
    super.insertBlockNode({ id: nodeId })
  }

  /*
    2.0 API suggestion (pass only id, not data)
  */
  insertInlineNode(nodeId) {
    const sel = this._selection
    if (sel && !sel.isNull() && sel.isPropertySelection()) {
      return this._impl.insertInlineNode(this, nodeId)
    }
  }

}
