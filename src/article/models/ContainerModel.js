import DefaultModel from './DefaultModel'

/*
  A model for container like content (e.g. <body> or <abstract>)
*/
export default class ContainerModel extends DefaultModel{
  constructor(node, contentNodeSelector, context) {
    super(node, context)
    this._contentNodeSelector = contentNodeSelector
  }
  
  getContainerNode() {
    let contentNode = this._node.find(this._contentNodeSelector)
    return contentNode
  }
  
}