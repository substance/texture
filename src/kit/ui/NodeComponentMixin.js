import renderValue from './_renderValue'

export default function (Component) {
  return class NodeComponent extends Component {
    didMount () {
      super.didMount()
      const node = this._getNode()
      this.context.appState.addObserver(['document'], this.rerender, this, { document: { path: [node.id] } })
    }

    dispose () {
      super.dispose()

      this.context.appState.off(this)
    }

    _getNode () {
      return this.props.node
    }

    _renderValue ($$, propertyName, options = {}) {
      let node = this._getNode()
      let doc = node.getDocument()
      return renderValue($$, this, doc, [node.id, propertyName], options)
    }
  }
}
