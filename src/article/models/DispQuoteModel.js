import { NodeModel, createValueModel, FlowContentModel, ModelProperty } from '../../kit'

export default class DispQuoteModel extends NodeModel {
  constructor (api, node) {
    super(api, node)
    this._attrib = createValueModel(api, 'text', [node.id, 'attrib'])
    this._content = new FlowContentModel(this, node.getContentPath())
  }

  /*
    EXPERIMENTAL: Override properties with custom value models
  */
  getProperties () {
    return [
      new ModelProperty('content', this._content),
      new ModelProperty('attrib', this._attrib)
    ]
  }

  get type () { return 'disp-quote' }

  getAttrib () {
    return this._attrib
  }

  getContent () {
    return this._content
  }
}
