import entityRenderers from '../entities/entityRenderers'

export default class TextureArticleAPI {
  constructor(editorSession, pubMetaDbSession) {
    this.editorSession = editorSession
    this.pubMetaDbSession = pubMetaDbSession
    this.pubMetaDb = pubMetaDbSession.getDocument()
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
    return new ContribsModel(articleMeta, this.pubMetaDb)
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

/*
  A model for holding authors and editors information.
*/
class ContribsModel {
  constructor(node, pubMetaDb) {
    this._articleMeta = node
    this._pubMetaDb = pubMetaDb
  }

  getAuthors() {
    let authorsContribGroup = this._articleMeta.find('contrib-group[content-type=author]')
    let contribIds = authorsContribGroup.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this._pubMetaDb.get(contribId))
  }

  /*
    Utility method to render a contrib object
  */
  renderContrib(contrib) {
    return entityRenderers[contrib.type](contrib.id, this._pubMetaDb)
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
