/* global vfs, TEST_VFS, Blob */
import {
  ObjectOperation, DocumentChange, isString, isArray, platform,
  Component, DefaultDOMElement
} from 'substance'
import { TextureWebApp, VfsStorageClient, createJatsImporter } from '../../index'
import TestVfs from './TestVfs'

export function setCursor (editor, path, pos) {
  if (isArray(path)) {
    path = path.join('.')
  }
  let property = editor.find(`.sc-text-property[data-path=${path.replace('.', '\\.')}]`)
  if (!property) {
    throw new Error('Could not find text property for path ' + path)
  }
  setCursorIntoProperty(property, pos)
}

export function setCursorIntoProperty (property, pos) {
  const path = property.getPath()
  let editorSession = property.context.editorSession
  let surface = property.context.surface
  editorSession.setSelection({
    type: 'property',
    path,
    startOffset: pos,
    surfaceId: surface.id,
    containerId: surface.containerId
  })
}

export function setSelection (editor, path, from, to) {
  if (!isString(path)) {
    path = path.join('.')
  }
  let property = editor.find(`.sc-text-property[data-path=${path.replace('.', '\\.')}]`)
  if (!property) {
    throw new Error('Could not find text property for path ' + path)
  }
  let editorSession = editor.context.editorSession
  let surface = property.context.surface
  editorSession.setSelection({
    type: 'property',
    path: path.split('.'),
    startOffset: from,
    endOffset: to,
    surfaceId: surface.id,
    containerId: surface.containerId
  })
}

export function insertText (editorSession, text) {
  editorSession.transaction(tx => {
    tx.insertText(text)
  })
}

export function applyNOP (editorSession) {
  editorSession._commit(new DocumentChange([new ObjectOperation({ type: 'NOP' })], {}, {}), {})
}

export function toUnix (str) {
  return str.replace(/\r?\n/g, '\n')
}

export function createTestApp (options = {}) {
  class App extends TextureWebApp {
    _getStorage (storageType) {
      let _vfs = options.vfs || vfs
      let _rootFolder = options.root || './data/'
      return new VfsStorageClient(_vfs, _rootFolder)
    }

    willUpdateState (newState) {
      if (newState.archive) {
        this.emit('archive:ready', newState.archive)
      } else if (newState.error) {
        this.emit('archive:failed', newState.error)
      }
    }
  }
  return App
}

export const LOREM_IPSUM = {
  vfs: TEST_VFS,
  rootDir: './tests/fixture/',
  archiveId: 'lorem-ipsum'
}

export function fixture (archiveId) {
  return {
    vfs: TEST_VFS,
    rootDir: './tests/fixture/',
    archiveId
  }
}

export function setupTestVfs (mainVfs, archiveId) {
  let data = {}
  let paths = Object.keys(mainVfs._data)
  for (let path of paths) {
    if (path.startsWith(archiveId + '/')) {
      data[path] = mainVfs._data[path]
    }
  }
  return new TestVfs(data)
}

// creates a vfs instance that contains a standard manifest
export function createTestVfs (seedXML) {
  let data = {
    "test/manifest.xml": "<dar>\n  <documents>\n    <document id=\"manuscript\" type=\"article\" path=\"manuscript.xml\" />\n  </documents>\n  <assets>\n  </assets>\n</dar>\n", //eslint-disable-line
    "test/manuscript.xml": seedXML, //eslint-disable-line
  }
  return new TestVfs(data)
}

export function openManuscriptEditor (app) {
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  return articlePanel.find('.sc-manuscript-editor')
}

export function openMetadataEditor (app) {
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'metadata')
  return articlePanel.find('.sc-metadata-editor')
}

export function getApi (editor) {
  return editor.context.api
}

export function getEditorSession (editor) {
  return editor.context.api.getArticleSession()
}

export function getSelection (editor) {
  return editor.context.appState.selection
}

export function getDocument (editor) {
  return editor.context.appState.document
}

export function loadBodyFixture (editor, xml) {
  let api = getApi(editor)
  let editorSession = getEditorSession(editor)
  let els = DefaultDOMElement.parseSnippet(xml, 'xml')
  if (!isArray(els)) els = [els]
  // make sure we only have elements here
  if (isArray(els)) els = els.filter(el => el.isElementNode())
  editorSession.transaction(tx => {
    let body = tx.get('body')
    api._clearFlowContent(tx, body.getContentPath())
    let importer = createJatsImporter(tx)
    body.append(
      els.map(el => importer.convertElement(el))
    )
  })
}

export class PseudoFileEvent {
  constructor () {
    let blob
    if (platform.inBrowser) {
      blob = new Blob(['abc'], {type: 'image/png'})
      blob.name = 'test.png'
    // FIXME: do something real in NodeJS
    } else {
      blob = { name: 'test.png', type: 'image/png' }
    }
    this.currentTarget = {
      files: [ blob ]
    }
  }
}

export function findParent (el, selector) {
  let isComponent = el._isComponent
  if (isComponent) {
    el = el.el
  }
  let parent = el.getParent()
  while (parent) {
    if (parent.is(selector)) {
      if (isComponent) {
        return Component.getComponentForDOMElement(parent)
      } else {
        return parent
      }
    }
    parent = parent.getParent()
  }
}
