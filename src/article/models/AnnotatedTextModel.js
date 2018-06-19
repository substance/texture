import DefaultModel from './DefaultModel'

/*
  A model for annotated text (e.g. <article-title>)
*/
export default class AnnotatedTextModel extends DefaultModel {
  getTextNode() {
    return this._node
  }

  getTextPath() {
    return this._node.getPath()
  }
}