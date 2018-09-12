export default function (Component) {
  class OverlayComponent extends Component {
    didMount () {
      super.didMount()

      let appState = this.context.appState

      appState.addObserver(['overlayId'], this._rerenderWhenOverlayIdHasChanged, this, { stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.appState.removeObserver(this)
    }

    _getOverlayId () {
      return this.getId()
    }

    _canShowOverlay () {
      return this.context.appState.overlayId === this._getOverlayId()
    }

    _toggleOverlay () {
      this.send('toggleOverlay', this._getOverlayId())
    }

    _rerenderWhenOverlayIdHasChanged () {
      console.log('Rerendering overlay component because overlay id has changed', this)
      this.rerender()
    }
  }
  return OverlayComponent
}
