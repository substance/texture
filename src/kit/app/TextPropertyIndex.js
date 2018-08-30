import { compareDOMElementPosition } from './compareDOMElementPosition'

export default class TextPropertyIndex {
  constructor () {
    this._index = new Map()
    this._sorted = null
  }

  registerTextProperty (tp) {
    this._index.set(String(tp.getPath()), tp)
    // invalidating the topology on every structural change
    this._sorted = null
  }

  unregisterTextProperty (tp) {
    this._index.delete(String(tp.getPath()))
    // invalidating the topology on every structural change
    this._sorted = null
  }

  getTextProperty (path) {
    return this._index.get(String(path))
  }

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
}
