export default function (Component) {
  class OverlayComponent extends Component {
    didMount () {
      super.didMount()

      this.context.appState.addObserver(['overlayId'], this._rerenderWhenOverlayIdHasChanged, this, { stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.appState.removeObserver(this)
    }

    _canShowOverlay () {
      return this.context.appState.overlayId === this.getId()
    }

    _toggleOverlay () {
      this.send('toggleOverlay', this.getId())
    }

    _rerenderWhenOverlayIdHasChanged () {
      // console.log('Rerendering overlay component because overlay id has changed', this.getId(), this)
      this.rerender()
    }
  }
  return OverlayComponent
}
