import { ContainerEditor as SubstanceContainerEditor } from 'substance'
import ModifiedSurface from './_ModifiedSurface'

/*
  Customized ContainerEditor that
    - works with Models, and AppState API,
    - produces a fall-back display for nodes which are not supported yet.
*/
export default class ContainerEditorNew extends ModifiedSurface(SubstanceContainerEditor) {
  // overriding event registration
  didMount () {
    super.didMount()

    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionChanged, this, {
      stage: 'render'
    })
    appState.addObserver(['document'], this._onContainerChanged, this, {
      stage: 'render',
      document: {
        path: this.containerPath
      }
    })
  }

  dispose () {
    super.dispose()

    this.context.appState.off(this)
  }

  // overriding this to control editability
  render ($$) {
    let el = super.render($$)

    if (this.isEditable()) {
      el.addClass('sm-editable')
    } else {
      el.addClass('sm-readonly')
      // HACK: removing contenteditable if not editable
      // TODO: we should fix substance.TextPropertyEditor to be consistent with props used in substance.Surface
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
        return this.getComponent('unsupported-node')
      }
    }
  }

  _getNodeProps (model) {
    let props = super._getNodeProps(model)
    props.placeholder = this.props.placeholder || this.getLabel(this.props.name + '-placeholder')
    return props
  }
}
