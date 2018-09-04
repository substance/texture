import { forEach, Marker } from 'substance'
import TextPropertyIndex from './TextPropertyIndex'
import MarkersIndex from './MarkersIndex'

// TODO: extract code that can be shared with original editorSession based implementation
// TODO: let this act as a reducer for editorState.markers
export default class MarkersManager {
  constructor (editorState) {
    this.editorState = editorState
    // registry
    this._textProperties = new TextPropertyIndex()
    this._dirtyProps = {}
    this._markers = new MarkersIndex(this)

    // keep markers up-to-date, and record which text properties
    // are affected by a change
    editorState.addObserver(['document'], this._onChange, this, { stage: 'update' })
    editorState.addObserver(['@any'], this._updateProperties, this, { stage: 'render' })
  }

  dispose () {
    this.editorState.off(this)
  }

  setMarkers (key, markers) {
    this.clearMarkers(key)
    markers.forEach(m => this.addMarker(key, m))
  }

  addMarker (key, marker) {
    marker._key = key
    if (!marker._isMarker) {
      marker = new Marker(this.editorState.document, marker)
    }
    this._markers.add(marker)
  }

  clearMarkers (key) {
    this._markers.clear(key)
  }

  clearPropertyMarkers (path, filter) {
    this._markers.clearPropertyMarkers(path, filter)
    this._dirtyProps[path] = true
  }

  addPropertyMarker (path, data) {
    // TODO: maybe provide a factory for creating markers
    this._markers.addPropertyMarker(path, new Marker(this.editorState.document, data))
    this._dirtyProps[path] = true
  }

  register (textPropertyComponent) {
    this._textProperties.registerTextProperty(textPropertyComponent)
  }

  deregister (textPropertyComponent) {
    this._textProperties.unregisterTextProperty(textPropertyComponent)
  }

  getMarkers (path, opts) {
    opts = opts || {}
    let doc = this.editorState.document
    let annos = doc.getAnnotations(path) || []
    let markers = this._markers.get(path, opts.surfaceId, opts.containerId)
    return annos.concat(markers)
  }

  _onChange (change) {
    // console.log('MarkersManager.onChange()', change)
    this._markers._onDocumentChange(change)
    this._recordDirtyTextProperties(change)
  }

  _recordDirtyTextProperties (change) {
    // mark all updated props per se as dirty
    forEach(change.updated, (val, id) => {
      this._dirtyProps[id] = true
    })
  }

  /*
    Trigger rerendering of all dirty text properties.
  */
  _updateProperties () {
    console.log('MarkersManager._updateProperties()')
    Object.keys(this._dirtyProps).forEach((path) => {
      let textPropertyComponent = this._textProperties.getTextProperty(path)
      if (textPropertyComponent) {
        this._updateTextProperty(textPropertyComponent)
      }
    })
    this._dirtyProps = {}
  }

  /*
    Here a dirty text property is rerendered via calling setState()
  */
  _updateTextProperty (textPropertyComponent) {
    let path = textPropertyComponent.getPath()
    let markers = this.getMarkers(path, {
      surfaceId: textPropertyComponent.getSurfaceId(),
      containerId: textPropertyComponent.getContainerId()
    })
    // console.log('## providing %s markers for %s', markers.length, path)
    textPropertyComponent.setState({
      markers: markers
    })
  }
}
