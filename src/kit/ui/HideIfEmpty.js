import { Component, $$, isNil, getKeyForPath } from 'substance'

export default class HiddenIfEmpty extends Component {
  getInitialState () {
    return this._deriveInitialState(this.props)
  }

  didMount () {
    const editorState = this.context.editorState
    const path = this.props.path
    // FIXME: it is not good to rerender on every selection change.
    // Instead it should derive a state from the selection, and only rerender if the
    // state has changed (not-selected, selected + author id)
    editorState.addObserver(['document'], this._onValueChange, this, { stage: 'render', document: { path } })
  }

  dispose () {
    super.dispose()
    this.context.editorState.removeObserver(this)
  }

  willReceiveProps (newProps) {
    if (getKeyForPath(this.props.path) !== getKeyForPath(newProps.path)) {
      this.setState(this._deriveInitialState(newProps))
    }
  }

  render () {
    const { isEmpty } = this.state
    const { children } = this.props
    if (isEmpty || !children) {
      return $$('div').addClass('sm-hidden')
    }
    return $$('div').append(children)
  }

  _deriveInitialState (props) {
    const { document, path } = props
    const property = document.getProperty(path)
    if (!property) throw new Error(`Property does not exist: ${path}`)
    return {
      property,
      isEmpty: this._isEmpty(property, document.get(path))
    }
  }

  _onValueChange () {
    const { document, path } = this.props
    const { property } = this.state
    this.extendState({ isEmpty: this._isEmpty(property, document.get(path)) })
  }

  _isEmpty (property, value) {
    switch (property.reflectionType) {
      case 'string':
      case 'text':
      case 'child':
      case 'single': {
        return !value
      }
      case 'children':
      case 'container':
      case 'many': {
        return !value || value.length === 0
      }
      default:
        return isNil(value)
    }
  }
}
