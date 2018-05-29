/*
  A model for annotated text (e.g. <article-title>)
*/
export default class DefaultModel {
  constructor(node, context) {
    this._node = node
    this.context = context
  }

  get id() {
    return this._node.id
  }

  get type() {
    return this._node.type
  }
}