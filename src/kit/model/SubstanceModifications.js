import {
  Surface as SubstanceSurface,
  ContainerEditor as SubstanceContainerEditor,
  IsolatedNodeComponent as SubstanceIsolatedNodeComponent,
  IsolatedInlineNodeComponent as SubstanceIsolatedInlineNodeComponent,
  TextPropertyComponent as SubstanceTextPropertyComponent,
  TextPropertyEditor as SubstanceTextPropertyEditor
} from 'substance'

/*
  This file contains derivations of core classes that
  are necessary to be compatible with the AppState and the Model API.
*/

/*
  Customized ContainerEditor that produces a fall-back display
  for nodes which are not supported yet.
*/
// TODO: try to provide basic Surface and ContainerEditor implementations
// making it easier to use a different data binding mechanism
export class ContainerEditorNew extends SubstanceContainerEditor {
  // overriding event registration
  didMount () {
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

  // overriding this to control editability
  render ($$) {
    let el = super.render($$)

    // HACK: removing contenteditable if not editable
    // TODO: we should fix substance.ContainerEditor to be consistent with props used in substance.Surface
    if (!this.isEditable()) {
      el.setAttribute('contenteditable', false)
    }

    return el
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

export class IsolatedInlineNodeComponentNew extends SubstanceIsolatedInlineNodeComponent {
  constructor (parent, props, options) {
    super(parent, props, options)
    if (!props.model) throw new Error("Property 'model' is required and must be a NodeModel")
    if (!props.model._node) throw new Error('Provided model must container a DocumentNode')
  }
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }
}

export class IsolatedNodeComponentNew extends SubstanceIsolatedNodeComponent {
  constructor (parent, props, options) {
    super(parent, props, options)
    if (!props.model) throw new Error("Property 'model' is required and must be a NodeModel")
    if (!props.model._node) throw new Error('Provided model must container a DocumentNode')
  }
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }
}

export class TextPropertyComponentNew extends SubstanceTextPropertyComponent {
  _getFragmentProps (node) {
    let props = super._getFragmentProps(node)
    let model = this.context.api.getModelById(node.id)
    props.model = model
    return props
  }

  _getUnsupportedInlineNodeComponentClass () {
    return this.getComponent('unsupported-inline-node')
  }
}

// TODO: try to provide basic Surface and ContainerEditor implementations
// making it easier to use a different data binding mechanism
export class TextPropertyEditorNew extends SubstanceTextPropertyEditor {
  // overriding event registration
  didMount () {
    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionChanged, this, {
      stage: 'render'
    })
    const surfaceManager = this.getSurfaceManager()
    if (surfaceManager) {
      surfaceManager.registerSurface(this)
    }
    const globalEventHandler = this.getGlobalEventHandler()
    if (globalEventHandler) {
      globalEventHandler.addEventListener('keydown', this._muteNativeHandlers, this)
    }
  }

  dispose () {
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
}
