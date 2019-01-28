import { DefaultDOMElement, platform } from 'substance'
import Clipboard from './_Clipboard'

export default function ModifiedSurface (Surface) {
  class _ModifiedSurface extends Surface {
    constructor (parent, props, options) {
      super(parent, _monkeyPatchSurfaceProps(parent, props), options)
    }

    didMount () {
      const surfaceManager = this.getSurfaceManager()
      if (surfaceManager && this.isEditable()) {
        surfaceManager.registerSurface(this)
      }
      const globalEventHandler = this.getGlobalEventHandler()
      if (globalEventHandler) {
        globalEventHandler.addEventListener('keydown', this._muteNativeHandlers, this)
      }
    }

    dispose () {
      const surfaceManager = this.getSurfaceManager()
      // ATTENTION: no matter if registered or not, we always try to unregister
      surfaceManager.unregisterSurface(this)
      const globalEventHandler = this.getGlobalEventHandler()
      if (globalEventHandler) {
        globalEventHandler.removeEventListener('keydown', this._muteNativeHandlers)
      }
    }

    setProps (newProps) {
      return super.setProps(_monkeyPatchSurfaceProps(this.parent, newProps))
    }

    render ($$) {
      // NOTE: experimenting with additional event handlers
      // After we are sure that we want this we should add this to the core implementation
      let el = super.render($$)
      if (!this.isDisabled()) {
        if (!this.isReadonly()) {
          // prevent click from bubbling up
          el.on('click', this.onClick)
        }
      }
      return el
    }

    _initializeClipboard () {
      return new Clipboard()
    }

    _onCopy (e) {
      e.preventDefault()
      e.stopPropagation()
      let clipboardData = e.clipboardData
      this.clipboard.copy(clipboardData, this.context)
    }

    _onCut (e) {
      e.preventDefault()
      e.stopPropagation()
      let clipboardData = e.clipboardData
      this.clipboard.cut(clipboardData, this.context)
    }

    _onPaste (e) {
      e.preventDefault()
      e.stopPropagation()
      let clipboardData = e.clipboardData
      // TODO: allow to force plain-text paste
      this.clipboard.paste(clipboardData, this.context)
    }

    // mostly copied from 'Substance.Surface.onMouseDown()'
    // trying to improve the mouse handling
    // not letting bubble up handled events
    onMouseDown (event) {
      if (!this._shouldConsumeEvent(event)) {
        // console.log('skipping mousedown', this.id)
        return false
      }
      // stopping propagation because now the event is considered to be handled
      event.stopPropagation()

      // EXPERIMENTAL: trying to 'reserve' a mousedown event
      // so that parents know that they shouldn't react
      // This is similar to event.stopPropagation() but without
      // side-effects.
      // Note: some browsers do not do clicks, selections etc. on children if propagation is stopped
      if (event.__reserved__) {
        // console.log('%s: mousedown already reserved by %s', this.id, event.__reserved__.id)
        return
      } else {
        // console.log('%s: taking mousedown ', this.id)
        event.__reserved__ = this
      }

      // NOTE: this is here to make sure that this surface is contenteditable
      // For instance, IsolatedNodeComponent sets contenteditable=false on this element
      // to achieve selection isolation
      if (this.isEditable()) {
        this.el.setAttribute('contenteditable', true)
      }

      // TODO: what is this exactly?
      if (event.button !== 0) {
        return
      }

      // special treatment for triple clicks
      if (!(platform.isIE && platform.version < 12) && event.detail >= 3) {
        let sel = this.getEditorSession().getSelection()
        if (sel.isPropertySelection()) {
          this._selectProperty(sel.path)
          event.preventDefault()
          event.stopPropagation()
          return
        } else if (sel.isContainerSelection()) {
          this._selectProperty(sel.startPath)
          event.preventDefault()
          event.stopPropagation()
          return
        }
      }
      // 'mouseDown' is triggered before 'focus' so we tell
      // our focus handler that we are already dealing with it
      // The opposite situation, when the surface gets focused e.g. using keyboard
      // then the handler needs to kick in and recover a persisted selection or such
      this._state.skipNextFocusEvent = true

      // this is important for the regular use case, where the mousup occurs within this component
      this.el.on('mouseup', this.onMouseUp, this)
      // NOTE: additionally we need to listen to mousup on document to catch events outside the surface
      // TODO: it could still be possible not to receive this event, if mouseup is triggered on a component that consumes the event
      if (platform.inBrowser) {
        let documentEl = DefaultDOMElement.wrapNativeElement(window.document)
        documentEl.on('mouseup', this.onMouseUp, this)
      }
    }

    onMouseUp (e) {
      // console.log('Surface.onMouseUp', this.id)
      this.el.off('mouseup', this.onMouseUp, this)
      if (platform.inBrowser) {
        let documentEl = DefaultDOMElement.wrapNativeElement(window.document)
        documentEl.off('mouseup', this.onMouseUp, this)
      }
      // console.log('Surface.onMouseup', this.id);
      // ATTENTION: filtering events does not make sense here,
      // as we need to make sure that pick the selection even
      // when the mouse is released outside the surface
      // if (!this._shouldConsumeEvent(e)) return
      e.stopPropagation()
      // ATTENTION: this delay is necessary for cases the user clicks
      // into an existing selection. In this case the window selection still
      // holds the old value, and is set to the correct selection after this
      // being called.
      this._delayed(() => {
        let sel = this.domSelection.getSelection()
        this._setSelection(sel)
      })
    }

    onClick (event) {
      if (!this._shouldConsumeEvent(event)) {
        // console.log('skipping mousedown', this.id)
        return false
      }
      // stop bubbling up here
      event.stopPropagation()
    }
  }
  return _ModifiedSurface
}

function _monkeyPatchSurfaceProps (parent, props) {
  let newProps = Object.assign({}, props)
  if (props.model && !props.node) {
    const model = props.model
    switch (model.type) {
      case 'collection': {
        newProps.containerPath = model._path
        break
      }
      default: {
        // TODO: do we really need this anymore?
        if (model._node) {
          newProps.node = model._node
        }
      }
    }
  }
  // TODO: we should revisit this in Substance
  if (props.editable === false || !parent.context.editable) {
    newProps.editing = 'readonly'
  }
  return newProps
}
