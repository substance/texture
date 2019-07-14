export default function (Component) {
  class OverlayComponent extends Component {
    didMount () {
      super.didMount()

      let appState = this.context.editorState
      appState.addObserver(['overlayId'], this._onOverlayIdHasChanged, this, { stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.editorState.removeObserver(this)
    }

    _getOverlayId () {
      return this.getId()
    }

    _canShowOverlay () {
      return this.context.editorState.overlayId === this._getOverlayId()
    }

    _toggleOverlay () {
      this.send('toggleOverlay', this._getOverlayId())
    }

    _onOverlayIdHasChanged () {
      console.log('Rerendering overlay component because overlay id has changed', this._getOverlayId())
      this.rerender()
    }
  }
  return OverlayComponent
}
