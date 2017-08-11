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

}
