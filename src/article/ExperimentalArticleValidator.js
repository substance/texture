/* eslint-disable no-use-before-define */
import { forEach, isNil } from 'substance'

/*
  EXPERIMENTAL: This should only be used as a prototype.
  After that must consolidate requirements and refactor.
*/

export default class ExperimentalArticleValidator {
  // TODO: maybe we want to use ArticleAPI here
  constructor (api) {
    this._api = api
  }

  initialize () {
    let article = this._getArticle()
    let editorState = this._getEditorState()
    forEach(article.getNodes(), node => {
      CheckRequiredFields.onCreate(this, node)
    })
    // TODO: or should we bind to editorState updates?
    editorState.addObserver(['document'], this._onDocumentChange, this, { stage: 'update' })
  }

  dispose () {
    let editorState = this._getEditorState()
    editorState.removeObserver(this)
  }

  /*
    Thought: potentially there are different kind of issues
  */
  clearIssues (path, type) {
    // Note: storing the issues grouped by propertyName in node['@issues']
    let nodeIssues = this._getNodeIssues(path[0])
    nodeIssues.clear(path.slice(1).join('.'), type)
    this._markAsDirty(path)
  }

  /*
    Thoughts: adding issues one-by-one, and clearing by type
  */
  addIssue (path, issue) {
    // console.log('ArticleValidator: adding issue for %s', path.join('.'), issue)
    let nodeIssues = this._getNodeIssues(path[0])
    nodeIssues.add(path.slice(1).join('.'), issue)
    this._markAsDirty(path)
  }

  _getEditorState () {
    return this._api.editorSession.editorState
  }

  _markAsDirty (path) {
    let editorState = this._getEditorState()
    // Note: marking both the node and the property as dirty
    const documentObserver = editorState._getDocumentObserver()
    const nodeId = path[0]
    let issuesPath = [nodeId, '@issues']
    documentObserver.setDirty(issuesPath)
    documentObserver.setDirty(issuesPath.concat(path.slice(1)))
  }

  _getNodeIssues (nodeId) {
    const article = this._getArticle()
    let node = article.get(nodeId)
    let issues = node['@issues']
    if (!issues) {
      issues = new NodeIssues()
      node['@issues'] = issues
    }
    return issues
  }

  /*
    Thoughts: the validator is triggered on document change, analyzing the change
    and triggering registered validators accordingly.
  */
  _onDocumentChange (change) {
    // ATTENTION: this is only a prototype implementation
    // This must be redesigned/rewritten when we move further
    const article = this._getArticle()
    // TODO: a DocumentChange could carry a lot more information
    // e.g. uodated[key] = { path, node, value }
    // It would also be better to separate explicit updates (~op.path) from derived updates (node id, annotation updates)
    Object.keys(change.created).forEach(id => {
      let node = article.get(id)
      if (node) {
        CheckRequiredFields.onCreate(this, node)
      }
    })
    Object.keys(change.updated).forEach(key => {
      let path = key.split(',')
      let node = article.get(path[0])
      if (node) {
        CheckRequiredFields.onUpdate(this, node, path, article.get(path))
      }
    })
  }

  _getArticle () {
    return this._api.getDocument()
  }

  _getApi () {
    return this._api
  }
}

const FIELD_IS_REQUIRED = {
  type: 'required-fields',
  label: 'field-is-required',
  message: 'Field is required'
}

const CheckRequiredFields = {
  onCreate (validator, node) {
    const api = validator._getApi()
    let data = node.toJSON()
    Object.keys(data).forEach(name => {
      if (api._isFieldRequired([node.id, name])) {
        this.onUpdate(validator, node, [node.id, name], data[name])
      }
    })
  },
  onUpdate (validator, node, path, value) {
    const api = validator._getApi()
    if (api._isFieldRequired(path)) {
      validator.clearIssues(path, FIELD_IS_REQUIRED.type)
      // TODO: we probably want to use smarter validators than this
      if (isNil(value) || value === '') {
        validator.addIssue(path, FIELD_IS_REQUIRED)
      }
    }
  }
}

class NodeIssues {
  constructor () {
    this._issuesByProperty = new Map()
  }

  get (propName) {
    return this._issuesByProperty.get(propName)
  }

  add (propName, issue) {
    if (!this._issuesByProperty.has(propName)) {
      this._issuesByProperty.set(propName, [])
    }
    let issues = this._issuesByProperty.get(propName)
    issues.push(issue)
  }

  clear (propName, type) {
    if (this._issuesByProperty.has(propName)) {
      let issues = this._issuesByProperty.get(propName)
      for (let i = issues.length - 1; i >= 0; i--) {
        if (issues[i].type === type) {
          issues.splice(i, 1)
        }
      }
      if (issues.length === 0) {
        this._issuesByProperty.delete(propName)
      }
    }
  }

  get size () {
    let size = 0
    this._issuesByProperty.forEach(issues => {
      size += issues.length
    })
    return size
  }
}
