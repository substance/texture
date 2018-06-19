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
    console.warn(' TODO: In the future ContainerEditor should work with ContainerModel, instead of low-level ContainerNode.')
    return this._node
  }
  
}