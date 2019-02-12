/* global vfs, TEST_VFS, Blob */
import {
  ObjectOperation, DocumentChange, isString, isArray, platform,
  Component, DefaultDOMElement, keys
} from 'substance'
import { TextureWebApp, VfsStorageClient, createJatsImporter } from '../../index'
import TestVfs from './TestVfs'
import { DOMEvent } from './testHelpers'

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
    containerPath: surface.getContainerPath()
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
    containerPath: surface.getContainerPath()
  })
}

export function selectCard (editor, id) {
  getApi(editor).selectModel(id)
}

export function selectNode (editor, id) {
  getApi(editor).selectNode(id)
}

export function deleteSelection (editor) {
  let editorSession = editor.context.editorSession
  editorSession.transaction((tx) => {
    tx.deleteSelection()
  })
}

export function insertText (editor, text) {
  let editorSession = editor.context.editorSession
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
      // TODO: find out if we still need options.root, because it looks like
      // we are using options.rootDir
      let _rootFolder = options.root || options.rootDir || '../data/'
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
  return editor.context.api.getEditorSession()
}

export function getSelection (editor) {
  return editor.context.appState.selection
}

export function getSelectionState (editor) {
  return editor.context.appState.selectionState
}

export function getDocument (editor) {
  return editor.context.appState.document
}

export function loadBodyFixture (editor, xml) {
  let editorSession = getEditorSession(editor)
  let els = DefaultDOMElement.parseSnippet(xml, 'xml')
  if (!isArray(els)) els = [els]
  // make sure we only have elements here
  if (isArray(els)) els = els.filter(el => el.isElementNode())
  editorSession.transaction(tx => {
    let body = tx.get('body')
    tx.set(body.getContentPath(), [])
    let importer = createJatsImporter(tx)
    let contentIds = els.map(el => importer.convertElement(el).id)
    tx.set(['body', 'content'], contentIds)
  })
}

export class PseudoFileEvent extends DOMEvent {
  constructor (name = 'test.png', type = 'image/png') {
    super()
    let blob = createPseudoFile(name, type)
    this.currentTarget = {
      files: [ blob ]
    }
  }
}

export function createPseudoFile (name, type) {
  let blob
  if (platform.inBrowser) {
    blob = new Blob(['abc'], { type })
    blob.name = name
  // FIXME: do something real in NodeJS
  } else {
    blob = { name, type }
  }
  return blob
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

export function clickUndo (editor) {
  editor.find('.sc-toggle-tool.sm-undo').el.click()
}

export function openMenu (editor, menuName) {
  let menu = editor.find(`.sc-tool-dropdown.sm-${menuName}`)
  let toggle = menu.refs.toggle
  if (!toggle.hasClass('sm-active')) {
    toggle.el.click()
  }
  return menu
}

export function openMenuAndFindTool (editor, menuName, toolSelector) {
  const menu = editor.find(`.sc-tool-dropdown.sm-${menuName}`)
  if (menu.hasClass('sm-disabled')) return false
  let toggle = menu.refs.toggle
  if (!toggle.hasClass('sm-active')) {
    toggle.el.click()
  }
  return menu.find(toolSelector)
}

export function isToolEnabled (editor, menuName, toolSelector) {
  let tool = openMenuAndFindTool(editor, menuName, toolSelector)
  return tool && !tool.getAttribute('disabled')
}

const TOOL_SPECS = {
  'bold': {
    menu: 'format',
    tool: '.sm-toggle-bold'
  },
  'italic': {
    menu: 'format',
    tool: '.sm-toggle-italic'
  },
  'monospace': {
    menu: 'format',
    tool: '.sm-toggle-monospace'
  },
  'small-caps': {
    menu: 'format',
    tool: '.sm-toggle-small-caps'
  },
  'subscript': {
    menu: 'format',
    tool: '.sm-toggle-subscript'
  },
  'superscript': {
    menu: 'format',
    tool: '.sm-toggle-superscript'
  },
  'underline': {
    menu: 'format',
    tool: '.sm-toggle-underline'
  }
}

export function annotate (editor, type) {
  let spec = TOOL_SPECS[type]
  if (!spec) throw new Error('Unsupported type ' + type)
  return openMenuAndFindTool(editor, spec.menu, spec.tool).click()
}

export function createKeyEvent (combo) {
  let frags = combo.split('+')
  let data = {
    keyCode: -1
  }
  for (var i = 0; i < frags.length; i++) {
    let frag = frags[i].toUpperCase()
    switch (frag) {
      case 'ALT': {
        data.altKey = true
        break
      }
      case 'ALTGR': {
        data.altKey = true
        data.code = 'AltRight'
        break
      }
      case 'CMD': {
        data.metaKey = true
        break
      }
      case 'CTRL': {
        data.ctrlKey = true
        break
      }
      case 'COMMANDORCONTROL': {
        if (platform.isMac) {
          data.metaKey = true
        } else {
          data.ctrlKey = true
        }
        break
      }
      case 'MEDIANEXTTRACK': {
        data.code = 'MediaTrackNext'
        break
      }
      case 'MEDIAPLAYPAUSE': {
        data.code = 'MediaPlayPause'
        break
      }
      case 'MEDIAPREVIOUSTRACK': {
        data.code = 'MediaPreviousTrack'
        break
      }
      case 'MEDIASTOP': {
        data.code = 'MediaStop'
        break
      }
      case 'SHIFT': {
        data.shiftKey = true
        break
      }
      case 'SUPER': {
        data.metaKey = true
        break
      }
      default:
        if (frag.length === 1) {
          data.keyCode = frag.charCodeAt(0)
        } else if (keys.hasOwnProperty(frag)) {
          data.keyCode = keys[frag]
        } else {
          throw new Error('Unsupported keyboard command: ' + combo)
        }
    }
  }
}
