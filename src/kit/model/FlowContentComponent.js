import { ContainerEditorNew } from './SubstanceModifications'

/*
  Customized ContainerEditor for FlowContentModels.
*/
export default class FlowContentComponent extends ContainerEditorNew {
  // overriding event registration
  didMount () {
    // ATTENTION: we are not calling super here, because we want to deviate from the default implementation
    if (this.context.editable) {
      let appState = this.context.appState
      appState.addObserver(['selection'], this._onSelectionChanged, this, {
        stage: 'render'
      })
      appState.addObserver(['document'], this._onContainerChanged, this, {
        stage: 'render',
        document: {
          path: this.container.getContentPath()
        }
      })

      const surfaceManager = this.getSurfaceManager()
      if (surfaceManager) {
        surfaceManager.registerSurface(this)
      }
      const globalEventHandler = this.getGlobalEventHandler()
      if (globalEventHandler) {
        globalEventHandler.addEventListener('keydown', this._muteNativeHandlers, this)
      }
      this._attachPlaceholder()
    }
  }

  dispose () {
    // ATTENTION: we are not calling super here, because we want to deviate from the default implementation
    this.context.appState.off(this)
    const surfaceManager = this.getSurfaceManager()
    if (surfaceManager) {
      surfaceManager.unregisterSurface(this)
    }
    const globalEventHandler = this.getGlobalEventHandler()
    if (globalEventHandler) {
      globalEventHandler.removeEventListener('keydown', this._muteNativeHandlers)
    }
  }

  render ($$) {
    let el = super.render($$).addClass('sc-flow-content')
    return el
  }

  // overriding the default implementation, to control the behavior
  // for nodes without explicitly registered component
  _getNodeComponentClass (node) {
    let ComponentClass = this.getComponent(node.type, 'not-strict')
    if (ComponentClass) {
      // text components are used directly
      if (node.isText() || this.props.disabled || !this.context.editable) {
        return ComponentClass
      // other components are wrapped into an IsolatedNodeComponent
      // except the component is itself a customized IsolatedNodeComponent
      } else if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
        return ComponentClass
      } else {
        return this.getComponent('isolated-node')
      }
    } else {
      // LEGACY: for text nodes without an component registered explicitly we use the default text component
      // TODO: try to get rid of this
      if (node.isText()) {
        return this.getComponent('text-node')
      // otherwise component for unsupported nodes
      } else {
        return this.getComponent('unsupported')
      }
    }
  }

  _getNodeProps (node) {
    let props = super._getNodeProps(node)
    let model = this.context.api.getModelById(node.id)
    props.model = model
    // TODO: get placeholder message using this.getLabel()
    props.placeholder = `Enter ${this.props.label}`
    return props
  }
}
