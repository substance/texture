import { Component, keys, platform } from 'substance'
import { createEditorContext } from '../../kit'

// Base-class for Manuscript- and MetadataEditor to reduced code-redundancy
export default class EditorPanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  // EXPERIMENTAL: Editor interface to be able to access the root element of editable content
  getContentPanel () {
    return this.refs.contentPanel
  }

  // TODO: shouldn't we react on willReceiveProps?
  _initialize (props) {
    const { editorSession } = props
    const config = this.context.config

    // ATTENTION: augmenting the default context with editor stuff and api etc.
    // TODO: try to find a more idiomatic approach, without needing to hack the context
    // This should be solvable by sharing things like 'api' on the ArticlePanel level
    // and adding other things to getChildContext()
    const context = Object.assign(this.context, createEditorContext(config, editorSession, this), {
      editable: true,
      editor: this
    })
    this.context = context
  }

  _restoreViewport () {
    if (this.props.viewport) {
      // console.log('Restoring viewport', this.props.viewport)
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }
  }

  dispose () {
    const appState = this.context.appState
    const editorSession = this._getEditorSession()
    editorSession.dispose()
    appState.removeObserver(this)
    this.props.archive.off(this)
  }

  getComponentRegistry () {
    return this.props.config.getComponentRegistry()
  }

  _getConfigurator () {
    return this.props.config
  }

  _getContentPanel () {
    /* istanbul ignore next */
    throw new Error('This method is abstract')
  }

  _getDocument () {
    return this._getEditorSession().getDocument()
  }

  _getEditorSession () {
    return this.props.editorSession
  }

  _getTheme () {
    // TODO: this should come from app settings
    return 'light'
  }

  _onKeydown (e) {
    // console.log('EditorPanel._onKeydown', e)
    let handled = false
    const appState = this.context.appState
    switch (e.keyCode) {
      case keys.ESCAPE: {
        if (appState.findAndReplace.enabled) {
          this.context.findAndReplaceManager.closeDialog()
          handled = true
        }
        break
      }
      default:
        //
    }
    if (!handled) {
      handled = this.context.keyboardManager.onKeydown(e, this.context)
    }
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }

  _renderWorkflow ($$, workflowId) {
    let Modal = this.getComponent('modal')
    let WorkflowComponent = this.getComponent(workflowId)
    return $$(Modal, {
      width: WorkflowComponent.desiredWidth
    }).addClass('se-workflow-modal sm-workflow-' + workflowId).append(
      $$(WorkflowComponent).ref('workflow')
    )
  }

  _scrollElementIntoView (el, force) {
    this._getContentPanel().scrollElementIntoView(el, !force)
  }

  // used for scrolling when clicking on TOC entries
  _scrollTo (params) {
    let selector
    if (params.nodeId) {
      selector = `[data-id="${params.nodeId}"]`
    } else if (params.section) {
      selector = `[data-section="${params.section}"]`
    } else {
      throw new Error('Illegal argument')
    }
    let comp = this.refs.contentPanel.find(selector)
    if (comp) {
      this._scrollElementIntoView(comp.el, true)
    }
    let router = this.context.router
    // ATTENTION: do not change the route when running tests otherwise the test url get's lost
    if (router && !platform.test) {
      router.writeRoute(Object.assign({ viewName: this.props.viewName }, params))
    }
  }
}