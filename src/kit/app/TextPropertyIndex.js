import { compareDOMElementPosition } from './compareDOMElementPosition'

export default class TextPropertyIndex {
  constructor () {
    this._index = new Map()
    this._sorted = null
  }

  isPathRegistered (path) {
    return this._index.has(String(path))
  }

  // TODO: is this really what we want? i.e. only one component allowed to rendered at a time
  // only registered properties will be updated by the MarkersManager
  registerTextProperty (tp) {
    let key = String(tp.getPath())
    if (this._index.has(key)) {
      throw new Error(`A TextPropertyComponent has already been registered for ${key}`)
    } else {
      this._index.set(key, tp)
      // invalidating the topology on every structural change
      this._sorted = null
    }
  }

  unregisterTextProperty (tp) {
    let key = String(tp.getPath())
    let registered = this._index.get(key)
    if (registered === tp) {
      this._index.delete(key)
      // invalidating the topology on every structural change
      this._sorted = null
    }
  }

  getTextProperty (path) {
    return this._index.get(String(path))
  }

  // get all registered components sorted by their position in the DOM
  getSorted () {
    if (!this._sorted) {
      let tps = Array.from(this._index.values())
      tps.sort((a, b) => {
        if (a === b) return 0
        return compareDOMElementPosition(a, b)
      })
      this._sorted = tps
    }
    return this._sorted
  }

  _hasProperty (pathStr) {
    return this._index.has(pathStr)
  }
}
