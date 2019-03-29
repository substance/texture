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
    props.placeholder = this.props.placeholder
    return props
  }

  _handleEnterKey (event) {
    // for SHIFT-ENTER a line break is inserted (<break> if allowed, or \n alternatively)
    if (event.shiftKey) {
      event.preventDefault()
      event.stopPropagation()
      this._softBreak()
    } else {
      super._handleEnterKey(event)
    }
  }

  _softBreak () {
    let editorSession = this.getEditorSession()
    let sel = editorSession.getSelection()
    if (sel.isPropertySelection()) {
      // find out if the current node allows for <break>
      let doc = editorSession.getDocument()
      let prop = doc.getProperty(sel.start.path)
      if (prop.targetTypes && prop.targetTypes.indexOf('break') !== -1) {
        editorSession.transaction(tx => {
          let br = tx.create({ type: 'break' })
          tx.insertInlineNode(br)
        }, { action: 'soft-break' })
      } else {
        editorSession.transaction(tx => {
          tx.insertText('\n')
        }, { action: 'soft-break' })
      }
    } else {
      editorSession.transaction((tx) => {
        tx.break()
      }, { action: 'break' })
    }
  }
}
