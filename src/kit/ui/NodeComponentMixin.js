import renderProperty from './_renderProperty'

export default function (Component) {
  return class NodeComponent extends Component {
    didMount () {
      super.didMount()
      const node = this._getNode()
      this.context.editorState.addObserver(['document'], this._onNodeUpdate, this, { document: { path: [node.id] }, stage: 'render' })
    }

    dispose () {
      super.dispose()

      this.context.editorState.off(this)
    }

    _getNode () {
      return this.props.node
    }

    _renderValue (propertyName, options = {}) {
      let node = this._getNode()
      let doc = node.getDocument()
      return renderProperty(this, doc, [node.id, propertyName], options)
    }

    _onNodeUpdate () {
      this.rerender()
    }
  }
}
