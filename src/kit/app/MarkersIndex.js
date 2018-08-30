import { ArrayTree } from 'substance'

/*
  A DocumentIndex implementation for keeping track of markers
*/
export default class MarkersIndex {
  constructor (manager) {
    this._manager = manager

    this._byKey = new ArrayTree()
    this._documentMarkers = new ArrayTree()
    this._surfaceMarkers = {}
    this._containerMarkers = {}
  }

  get (path, surfaceId) {
    let markers = this._documentMarkers[path] || []
    if (surfaceId && this._surfaceMarkers[surfaceId]) {
      let surfaceMarkers = this._surfaceMarkers[surfaceId][path]
      if (surfaceMarkers) markers = markers.concat(surfaceMarkers)
    }
    // TODO support container scoped markers
    return markers
  }

  add (marker) {
    const key = marker._key
    this._byKey.add(key, marker)
    this._add(marker)
  }

  // used to remove a single marker when invalidated
  remove (marker) {
    const key = marker._key
    this._byKey.remove(key, marker)
    this._remove(marker)
  }

  // remove all markers for a given key
  clear (key) {
    let markers = this._byKey.get(key)
    markers.forEach((marker) => {
      this._remove(marker)
    })
  }

  _add (marker) {
    const dirtyProps = this._manager._dirtyProps
    // console.log('Indexing marker', marker)
    const scope = marker.scope || 'document'
    switch (scope) {
      case 'document': {
        const path = marker.start.path
        // console.log('Adding marker for path', path, marker)
        dirtyProps[path] = true
        this._documentMarkers.add(path, marker)
        break
      }
      case 'surface': {
        if (!this._surfaceMarkers[marker.surfaceId]) {
          this._surfaceMarkers[marker.surfaceId] = new ArrayTree()
        }
        const path = marker.start.path
        dirtyProps[path] = true
        this._surfaceMarkers[marker.surfaceId].add(path, marker)
        break
      }
      case 'container': {
        console.warn('Container scoped markers are not supported yet')
        break
      }
      default:
        console.error('Invalid marker scope.')
    }
  }

  _remove (marker) {
    const dirtyProps = this._manager._dirtyProps
    const scope = marker.scope || 'document'
    switch (scope) {
      case 'document': {
        const path = marker.start.path
        dirtyProps[path] = true
        this._documentMarkers.remove(path, marker)
        break
      }
      case 'surface': {
        if (!this._surfaceMarkers[marker.surfaceId]) {
          this._surfaceMarkers[marker.surfaceId] = new ArrayTree()
        }
        const path = marker.start.path
        dirtyProps[path] = true
        this._surfaceMarkers[marker.surfaceId].remove(path, marker)
        break
      }
      case 'container': {
        console.warn('Container scoped markers are not supported yet')
        break
      }
      default:
        console.error('Invalid marker scope.')
    }
  }

  // used for applying transformations
  _getAllCustomMarkers (path) {
    let markers = this._documentMarkers[path] || []
    for (let surfaceId in this._surfaceMarkers) {
      if (!this._surfaceMarkers.hasOwnProperty(surfaceId)) continue
      let surfaceMarkers = this._surfaceMarkers[surfaceId][path]
      if (surfaceMarkers) markers = markers.concat(surfaceMarkers)
    }
    // TODO: support container markers
    return markers
  }

  _onDocumentChange (change) {
    change.ops.forEach((op) => {
      if (op.type === 'update' && op.diff._isTextOperation) {
        let markers = this._getAllCustomMarkers(op.path)
        let diff = op.diff
        switch (diff.type) {
          case 'insert':
            this._transformInsert(markers, diff)
            break
          case 'delete':
            this._transformDelete(markers, diff)
            break
          default:
            //
        }
      }
    })
  }

  _transformInsert (markers, op) {
    const pos = op.pos
    const length = op.str.length
    if (length === 0) return
    markers.forEach((marker) => {
      // console.log('Transforming marker after insert')
      var start = marker.start.offset
      var end = marker.end.offset
      var newStart = start
      var newEnd = end
      if (pos >= end) return
      if (pos <= start) {
        newStart += length
        newEnd += length
        marker.start.offset = newStart
        marker.end.offset = newEnd
        return
      }
      if (pos < end) {
        newEnd += length
        marker.end.offset = newEnd
        // NOTE: right now, any change inside a marker
        // removes the marker, as opposed to changes before
        // which shift the marker
        this._remove(marker)
      }
    })
  }

  _transformDelete (markers, op) {
    const pos1 = op.pos
    const length = op.str.length
    const pos2 = pos1 + length
    if (pos1 === pos2) return
    markers.forEach((marker) => {
      var start = marker.start.offset
      var end = marker.end.offset
      var newStart = start
      var newEnd = end
      if (pos2 <= start) {
        newStart -= length
        newEnd -= length
        marker.start.offset = newStart
        marker.end.offset = newEnd
      } else if (pos1 >= end) {

      // the marker needs to be changed
      // now, there might be cases where the marker gets invalid, such as a spell-correction
      } else {
        if (pos1 <= start) {
          newStart = start - Math.min(pos2 - pos1, start - pos1)
        }
        if (pos1 <= end) {
          newEnd = end - Math.min(pos2 - pos1, end - pos1)
        }
        // TODO: we should do something special when the change occurred inside the marker
        if (start !== end && newStart === newEnd) {
          this._remove(marker)
          return
        }
        if (start !== newStart) {
          marker.start.offset = newStart
        }
        if (end !== newEnd) {
          marker.end.offset = newEnd
        }
        this._remove(marker)
      }
    })
  }
}
