export default function (Component) {
  return class NodeComponent extends Component {
    // constructor (parent, props, options) {
    //   super(parent, props, options)
    //   // TODO: at some point we do not want to allow old-school components anymore
    //   // if (!props.model) throw new Error("Property 'model' is required and must be a NodeModel")
    //   // if (!props.model._node) throw new Error('Provided model must container a DocumentNode')
    // }
    didMount () {
      super.didMount()
      const node = this.getNode()
      this.context.appState.addObserver(['document'], this.rerender, this, { document: { path: [node.id] } })
    }

    dispose () {
      super.dispose()

      this.context.appState.off(this)
    }

    getNode () {
      return this.props.node || this.props.model._node
    }
  }
}
