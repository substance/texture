import { platform } from 'substance'

export default class SurfaceManager {
  constructor (editorState) {
    this.editorState = editorState
    this.surfaces = {}

    editorState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'update' })
    editorState.addObserver(['selection', 'document'], this._recoverDOMSelection, this, { stage: 'post-render' })
  }

  dispose () {
    this.editorState.off(this)
  }

  getSurface (name) {
    if (name) {
      return this.surfaces[name]
    }
  }

  getFocusedSurface () {
    console.error("DEPRECATED: use 'context.editorState.focusedSurface instead")
    return this.editorState.focusedSurface
  }

  registerSurface (surface) {
    const id = surface.getId()
    if (this.surfaces[id]) {
      console.error(`A surface with id ${id} has already been registered.`)
    }
    this.surfaces[id] = surface
  }

  unregisterSurface (surface) {
    let surfaceId = surface.getId()
    let registeredSurface = this.surfaces[surfaceId]
    if (registeredSurface === surface) {
      delete this.surfaces[surfaceId]
    }
  }

  _onSelectionChange () {
    // console.log('SurfaceManager._onSelectionChange()')
    const selection = this.editorState.selection
    // update state.focusedSurface
    this._reduceFocusedSurface(selection)
    // HACK: removing DOM selection *and* blurring when having a CustomSelection
    // otherwise we will receive events on the wrong surface
    // instead of bubbling up to GlobalEventManager
    if (selection && selection.isCustomSelection() && platform.inBrowser) {
      window.getSelection().removeAllRanges()
      window.document.activeElement.blur()
    }
  }

  _reduceFocusedSurface (sel) {
    const editorState = this.editorState
    let surface = null
    if (sel && sel.surfaceId) {
      surface = this.surfaces[sel.surfaceId]
    }
    editorState.focusedSurface = surface
  }

  /*
    At the end of the update flow, make sure the surface is focused
    and displays the right DOM selection
  */
  _recoverDOMSelection () {
    // console.log('SurfaceManager._recoverDOMSelection()')
    const editorState = this.editorState
    // do not rerender the selection if the editorSession has
    // been blurred, e.g., while some component, such as Find-And-Replace
    // dialog has the focus
    if (editorState.isBlurred) return
    let focusedSurface = editorState.focusedSurface
    // console.log('focusedSurface', focusedSurface)
    if (focusedSurface && !focusedSurface.isDisabled()) {
      // console.log('Rendering selection on surface', focusedSurface.getId(), this.editorSession.getSelection().toString());
      focusedSurface._focus()
      focusedSurface.rerenderDOMSelection()
    } else {
      // NOTE: Tried to add an integrity check here
      // for valid sel.surfaceId
      // However this is problematic, when an editor
      // is run headless, i.e. when there are no surfaces rendered
      // On the long run we should separate these to modes
      // more explicitly. For now, any code using surfaces need
      // to be aware of the fact, that this might be not availabls
      // while in the model it is referenced.
    }
  }
}
