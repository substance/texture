import { Component } from 'substance'
import { AppState, createComponentContext } from '../kit'

const DEFAULT_VIEW = 'manuscript'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)
    this._initialize(this.props, this.state)
    this.handleActions({
      'updateViewName': this._updateViewName
    })
  }

  _updateViewName (viewName) {
    this.context.appState.viewName = viewName
    this.rerender()
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
      viewName,
      api,
      archive,
      config,
      articleSession
    })
  }

  _createAppState (config) { // eslint-disable-line no-unused-vars
    const appState = new AppState({
      viewName: DEFAULT_VIEW
    })
    appState.addObserver(['view'], this.rerender, this, { stage: 'render' })
    return appState
  }
}
