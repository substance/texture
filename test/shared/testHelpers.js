import { getMountPoint } from 'substance-test'
import {
  InternalArticleDocument, InternalArticleSchema,
  createJatsImporter, createJatsExporter, createEmptyJATS
} from '../../index'

export { test, spy, wait, getMountPoint, testAsync } from 'substance-test'

export function _async (fn) {
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

export function exportElement (el) {
  let jats = createEmptyJATS()
  let exporter = createJatsExporter(jats, el.getDocument())
  return exporter.convertNode(el)
}
