export default function (Component) {
  class OverlayComponent extends Component {
    getChildContext () {
      return { overlay: this }
    }

    didMount () {
      super.didMount()

      let appState = this.context.appState

      appState.addObserver(['overlayId'], this._onOverlayIdHasChanged, this, { stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.appState.removeObserver(this)
    }

    _getOverlayId () {
      return this.props.overlayId || this.getId()
    }

    _canShowOverlay () {
      return this.context.appState.overlayId === this._getOverlayId()
    }

    _toggleOverlay () {
      this.send('toggleOverlay', this._getOverlayId())
    }

    _onOverlayIdHasChanged () {
      // console.log('Rerendering overlay component because overlay id has changed', this._getOverlayId()')
      this.rerender()
    }
  }
  return OverlayComponent
}
