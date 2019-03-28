import { platform } from 'substance'
import {
  InternalArticleDocument, InternalArticleSchema,
  createJatsImporter, createJatsExporter, createEmptyJATS
} from '../../index'
import getMountPoint from './getMountPoint'

export { test, spy, wait, testAsync } from 'substance-test'

export { getMountPoint }

export function promisify (fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

export class DOMEvent {
  constructor (props) {
    Object.assign(this, props)
  }
  stopPropagation () {}
  preventDefault () {}
}

export class ClipboardEventData {
  constructor () {
    this.data = {}
  }

  getData (format) {
    return this.data[format]
  }

  setData (format, data) {
    this.data[format] = data
  }

  get types () {
    return Object.keys(this.data)
  }
}

export class ClipboardEvent {
  constructor () {
    this.clipboardData = new ClipboardEventData()
  }
  preventDefault () {}
  stopPropagation () {}
}

export function diff (actual, expected) {
  let colors = require('colors')
  let jsdiff = require('diff')
  return jsdiff.diffChars(expected, actual).map(part => {
    // green for additions, red for deletions
    // grey for common parts
    let color = colors.grey
    let str = part.value
    if (part.added) {
      color = colors.green
    } else if (part.removed) {
      color = colors.red
    } else {
      let lines = str.split(/\r?\n/)
      let L = lines.length
      if (L > 5) {
        str = [lines[0], '...', lines[L - 1]].join('\n')
      }
    }
    return color(str)
  }).join('')
}

export function injectStyle (t, style) {
  let sandbox = getMountPoint(t)
  sandbox.insertAt(0, sandbox.createElement('style').text(style))
}

export function importElement (el) {
  let doc = InternalArticleDocument.createEmptyArticle(InternalArticleSchema)
  let importer = createJatsImporter(doc)
  return importer.convertElement(el)
}

export function exportNode (node) {
  let jats = createEmptyJATS()
  let exporter = createJatsExporter(jats, node.getDocument())
  return exporter.convertNode(node)
}

export function doesNotThrowInNodejs (t, fn, descr) {
  if (platform.inNodeJS) {
    t.doesNotThrow(fn, descr)
  } else {
    let success = false
    try {
      fn()
      success = true
    } finally {
      t.ok(success, descr)
    }
  }
}
