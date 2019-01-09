import { Component } from 'substance'
import { AppState, createComponentContext } from '../kit'

const DEFAULT_VIEW = 'manuscript'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)
    this._initialize(this.props, this.state)

    // Store the viewports, so we can restore scroll positions
    this._viewports = {}
    this.handleActions({
      'updateViewName': this._updateViewName
    })
  }

  _initialize (props) {
    const archive = props.archive
    const config = props.config

    this.context = Object.assign(createComponentContext(config), {
      urlResolver: archive,
      appState: this.state
    })
  }

  getInitialState () {
    // using AppState as Component state
    return this._createAppState(this.props.config)
  }

  willReceiveProps (props) {
    if (props.documentSession !== this.props.documentSession) {
      let state = this._createAppState(props.config)
      this._initialize(props, state)
      // wipe children and update state
      this.empty()
      this.setState(state)
    }
  }

  getChildContext () {
    return {
      appState: this.state
    }
  }

  shouldRerender (newProps, newState) {
    return (
      newProps.documentSession !== this.props.documentSession ||
      newProps.config !== this.props.config ||
      newState !== this.state
    )
  }

  render ($$) {
    let el = $$('div').addClass('sc-article-panel')
    el.append(
      this._renderContent($$)
    )
    return el
  }

  _renderContent ($$) {
    const props = this.props
    const viewName = this.state.viewName
    const api = this.api
    const archive = props.archive
    const articleSession = props.documentSession
    const config = props.config.getConfiguration(viewName)
    const viewport = this._viewports[viewName]

    let ContentComponent
    switch (viewName) {
      case 'manuscript': {
        ContentComponent = this.getComponent('manuscript-editor')
        break
      }
      case 'metadata': {
        ContentComponent = this.getComponent('metadata-editor')
        break
      }
      case 'reader': {
        ContentComponent = this.getComponent('article-reader')
        break
      }
      default:
        throw new Error('Unsupported view: ' + viewName)
    }
    return $$(ContentComponent, {
      viewport,
      viewName,
      api,
      archive,
      config,
      articleSession
    }).ref('content')
  }

  _createAppState (config) { // eslint-disable-line no-unused-vars
    const appState = new AppState({
      viewName: DEFAULT_VIEW
    })
    appState.addObserver(['view'], this.rerender, this, { stage: 'render' })
    return appState
  }

  _updateViewName (viewName) {
    let oldViewName = this.context.appState.viewName
    if (oldViewName !== viewName) {
      this.context.appState.viewName = viewName
      this._viewports[oldViewName] = this.refs.content.getViewport()
      this.rerender()
    }
  }

  _handleKeydown (e) {
    // console.log('ArticlePanel._handleKeydown', e)
    // ATTENTION: asking the currently active content to handle the keydown event first
    let handled = this.refs.content._onKeydown(e)
    // Note: if we had a keyboardManager here we could ask it to handle the event
    // if (!handled) {
    //   handled = this.context.keyboardManager.onKeydown(e, this.context)
    // }
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }
}
