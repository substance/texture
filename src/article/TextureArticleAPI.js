export default class TextureArticleAPI {
  constructor(editorSession) {
    this.editorSession = editorSession
    this.doc = editorSession.getDocument()
  }

  getArticleTitle() {
    let articleTitle = this.doc.find('article-title')
    return new AnnotatedTextModel(articleTitle)
  }

  getArticleAbstract() {
    let abstract = this.doc.find('abstract')
    return new ContainerModel(abstract, 'abstract-content')
  }

  getArticleBody() {
    let body = this.doc.find('body')
    return new ContainerModel(body, 'body-content')
  }

  getContribs() {
    let articleMeta = this.doc.find('article-meta')
    return new ContribsModel(articleMeta)
  }

  getReferences() {
    let refList = this.doc.find('ref-list')
    return new ReferencesModel(refList)
  }
}


class ReferencesModel {
  constructor(refList) {
    this._refList = refList
  }

}

class ContribsModel {
  constructor(node) {
    this._articleMeta = node
  }
}

/*
  A model for annotated text (e.g. <article-title>)
*/
class AnnotatedTextModel {
  constructor(node) {
    this._node = node
  }

  getTextNode() {
    return this._node
  }

  getTextPath() {
    return this._node.getPath()
  }

  get id() {
    return this._node.id
  }
}


/*
  A model for container like content (e.g. <body> or <abstract>)
*/
class ContainerModel {
  constructor(node, contentNodeSelector) {
    this._node = node
    this._contentNodeSelector = contentNodeSelector
  }

  getContainerNode() {
    let contentNode = this._node.find(this._contentNodeSelector)
    return contentNode
  }

  get id() {
    return this._node.id
  }
}
