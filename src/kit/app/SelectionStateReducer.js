import {
  documentHelpers, Selection, selectionHelpers
} from 'substance'

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
      state.isFirst = selectionHelpers.isFirst(doc, sel.start)
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
      state.isLast = selectionHelpers.isLast(doc, sel.end)
    }
  }

  deriveAnnoState (state, doc, sel) {
    // create a mapping by type for the currently selected annotations
    // create a mapping by type for the currently selected annotations
    let annosByType = {}
    function _add (anno) {
      if (!annosByType[anno.type]) {
        annosByType[anno.type] = []
      }
      annosByType[anno.type].push(anno)
    }
    const propAnnos = documentHelpers.getPropertyAnnotationsForSelection(doc, sel)
    propAnnos.forEach(_add)
    if (propAnnos.length === 1 && propAnnos[0].isInlineNode()) {
      state.isInlineNodeSelection = propAnnos[0].getSelection().equals(sel)
    }
    const containerId = sel.containerId
    if (containerId) {
      const containerAnnos = documentHelpers.getContainerAnnotationsForSelection(doc, sel, containerId)
      containerAnnos.forEach(_add)
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
      isInlineNodeSelection: false,
      // container information (only for ContainerSelection)
      container: null,
      previousNode: null,
      nextNode: null,
      // if the previous node is one char away
      isFirst: false,
      // if the next node is one char away
      isLast: false
    })
  }
}
