export default function (Component) {
  return class NodeComponent extends Component {
    didMount () {
      super.didMount()

      this.context.appState.addObserver(['document'], this.rerender, this, { document: { path: [this.props.node.id] } })
    }

    dispose () {
      super.dispose()

      this.context.appState.off(this)
    }
  }
}
