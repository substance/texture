export default function (Component) {
  class OverlayComponent extends Component {
    didMount () {
      super.didMount()

      this.context.appState.addObserver(['overlayId'], this.rerender, this, { stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.appState.removeObserver(this)
    }

    _canShowOverlay () {
      return this.context.appState.overlayId === this.getId()
    }

    _toggleOverlay (event) {
      event.stopPropagation()
      this.send('toggleOverlay', this.getId())
    }
  }
  return OverlayComponent
}
