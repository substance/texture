import { ContainerEditor } from 'substance'

/*
  Customized ContainerEditor for FlowContentModels.
*/
export default class FlowContentModelEditor extends ContainerEditor {
  constructor (parent, props, options) {
    // TODO: we should refactor ContainerEditor so that it is easier to customize
    super(parent, _monkeyPatchProps(props), options)
  }

  setProps (newProps) {
    return super.setProps(_monkeyPatchProps(newProps))
  }

  // overriding event registration
  didMount () {
    // ATTENTION: we are not calling super here, because we want to deviate from the default implementation
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

  // overriding the default implementation, to control the behavior
  // for nodes without explicitly registered component
  _getNodeComponentClass (node) {
    let ComponentClass = this.getComponent(node.type, 'not-strict')
    if (ComponentClass) {
      // text components are used directly
      if (node.isText() || this.props.disabled) {
        return ComponentClass
      // other components are wrapped into an IsolatedNodeComponent
      // except the component is itself a customized IsolatedNodeComponent
      } else if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
        return ComponentClass
      } else {
        return this.getComponent('isolated-node')
      }
    } else {
      // for text nodes without an component registered explicitly
      // we use the default text component
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
    let model = this.context.api.getModel(node)
    props.model = model
    return props
  }
}

function _monkeyPatchProps (props) {
  let newProps = Object.assign({}, props)
  const model = props.model
  newProps.containerId = model.id
  newProps.node = model._node
  delete newProps.model
  return newProps
}
