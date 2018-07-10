import {
  TreeIndex, documentHelpers, Selection, selectionHelpers
} from 'substance'

import globals from '../textureGlobals'

export default class SelectionStateReducer {
  constructor (appState) {
    this.appState = appState
    appState.addObserver(['document', 'selection'], this.update, this, { stage: 'update' })
  }

  update () {
    const appState = this.appState
    let doc = appState.get('document')
    let sel = appState.get('selection')
    let newState = this.deriveState(doc, sel)
    appState.set('selectionState', newState)
  }

  deriveState (doc, sel) {
    let state = this.createState(sel)
    this.deriveContainerSelectionState(state, doc, sel)
    this.deriveAnnoState(state, doc, sel)
    if (doc.getIndex('markers')) {
      this.deriveMarkerState(state, doc, sel)
    }
    return state
  }

  deriveContainerSelectionState (state, doc, sel) {
    if (sel.containerId) {
      let container = doc.get(sel.containerId)
      state.container = container
      let startId = sel.start.getNodeId()
      let endId = sel.end.getNodeId()
      let startNode = doc.get(startId).getContainerRoot()
      let startPos = container.getPosition(startNode)
      if (startPos > 0) {
        state.previousNode = container.getNodeAt(startPos - 1)
      }
      state._isFirst = selectionHelpers.isFirst(doc, sel.start)
      let endNode, endPos
      if (endId === startId) {
        endNode = startNode
        endPos = startPos
      } else {
        endNode = doc.get(endId).getContainerRoot()
        endPos = container.getPosition(endNode)
      }
      if (endPos < container.getLength() - 1) {
        state.nextNode = container.getNodeAt(endPos + 1)
      }
      state._isLast = selectionHelpers.isLast(doc, sel.end)
    }
  }

  deriveAnnoState (state, doc, sel) {
    // create a mapping by type for the currently selected annotations
    let annosByType = new TreeIndex.Arrays()
    const propAnnos = documentHelpers.getPropertyAnnotationsForSelection(doc, sel)
    propAnnos.forEach(function (anno) {
      annosByType.add(anno.type, anno)
    })

    if (propAnnos.length === 1 && propAnnos[0].isInline()) {
      state._isInlineNodeSelection = propAnnos[0].getSelection().equals(sel)
    }

    const containerId = sel.containerId
    if (containerId) {
      const containerAnnos = documentHelpers.getContainerAnnotationsForSelection(doc, sel, containerId)
      containerAnnos.forEach(function (anno) {
        annosByType.add(anno.type, anno)
      })
    }
    state.annosByType = annosByType
  }

  deriveMarkerState (state, doc, sel) {
    let markers = documentHelpers.getMarkersForSelection(doc, sel)
    state.markers = markers
  }

  createState (sel) {
    return new SelectionState(sel)
  }
}

class SelectionState {
  constructor (sel) {
    this.selection = sel || Selection.null

    Object.assign(this, {
      // all annotations under the current selection
      annosByType: null,
      // markers under the current selection
      markers: null,
      // flags for inline nodes
      _isInlineNodeSelection: false,
      // container information (only for ContainerSelection)
      container: null,
      previousNode: null,
      nextNode: null,
      // if the previous node is one char away
      _isFirst: false,
      // if the next node is one char away
      _isLast: false
    })
  }

  // HACK: for legacy reasons
  getSelection () {
    if (globals.DEBUG) console.error("DEPRECATED: Use EditorState.get('selection') instead")
    return this.selection
  }

  getAnnotationsForType (type) {
    if (globals.DEBUG) console.error("DEPRECATED: Use EditorState.get('selectionState').annosByType instead")
    const state = this
    if (state.annosByType) {
      return state.annosByType.get(type) || []
    }
    return []
  }

  isInlineNodeSelection () {
    if (globals.DEBUG) console.error('FIXME: we want to get rid of selectionState.isInlineNodeSelection() and use the flat property instead')
    return this._isInlineNodeSelection
  }

  isFirst () {
    if (globals.DEBUG) console.error('FIXME: we want to get rid of selectionState.isFirst() and use the flat property instead')
    return Boolean(this._isFirst)
  }

  isLast () {
    if (globals.DEBUG) console.error('FIXME: we want to get rid of selectionState.isLast() and use the flat property instead')
    return Boolean(this._isLast)
  }

  // FIXME: AbstractIsolatedNodeComponent uses this to monkey-patch the selection state
  // This should be solved in a different way
  get (name) {
    return this[name]
  }
  set (name, val) {
    this[name] = val
  }
}
