import { forEach, Marker, EventEmitter } from 'substance'
import TextPropertyIndex from './TextPropertyIndex'
import MarkersIndex from './MarkersIndex'

// TODO: extract code that can be shared with original editorSession based implementation
// TODO: let this act as a reducer for editorState.markers
// EXPERIMENTAL: events emitted by this class are meant for internal use only
export default class MarkersManager extends EventEmitter {
  constructor (editorState) {
    super()

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
    // ATTENTION: see note about events above
    this.emit('text-property:registered', textPropertyComponent.getPath())
  }

  deregister (textPropertyComponent) {
    this._textProperties.unregisterTextProperty(textPropertyComponent)
    // ATTENTION: see note about events above
    this.emit('text-property:deregistered', textPropertyComponent.getPath())
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
    const textProperties = this._textProperties
    // mark all updated props per se as dirty
    forEach(change.updated, (val, id) => {
      if (textProperties._hasProperty(id)) {
        this._dirtyProps[id] = true
        // ATTENTION: see note about events above
        this.emit('text-property:changed', id)
      }
    })
  }

  /*
    Trigger rerendering of all dirty text properties.
  */
  _updateProperties () {
    // console.log('MarkersManager._updateProperties()')
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
