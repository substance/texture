const SLASH = '/'.charCodeAt(0)

export default class Vfs {
  constructor (data) {
    this._data = data
  }

  existsSync (path) {
    return this._data.hasOwnProperty(path)
  }

  readFileSync (path) {
    if (path.charCodeAt(0) === SLASH) {
      path = path.slice(1)
    }
    if (!this.existsSync(path)) {
      throw new Error('File does not exist: ' + path)
    }
    return this._data[path]
  }

  writeFileSync (path, content) {
    if (path.charCodeAt(0) === SLASH) {
      path = path.slice(1)
    }
    this._data[path] = content
  }
}
