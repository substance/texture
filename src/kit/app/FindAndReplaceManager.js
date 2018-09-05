import { debounce } from 'substance'

const UPDATE_DELAY = 200

export default class FindAndReplaceManager {
  constructor (appState, markersManager) {
    this._appState = appState
    this._markersManager = markersManager
    this._dirty = new Set()

    // EXPERIMENTAL: we use the MarkersManager to detect changes on text-properties
    markersManager.on('text-property:registered', this._onTextPropertyChanged, this)
    markersManager.on('text-property:deregistered', this._onTextPropertyChanged, this)
    markersManager.on('text-property:changed', this._onTextPropertyChanged, this)

    appState.addObserver(['document'], this._onDocumentChange, this, { stage: 'render' })

    this._updateSearch = debounce(this._updateSearch.bind(this), UPDATE_DELAY)
  }

  openDialog (enableReplace) {
    enableReplace = Boolean(enableReplace)
    let state = this._getState()
    if (state.enabled) {
      // update state if 'showReplace' has changed
      if (state.showReplace !== enableReplace) {
        state.showReplace = Boolean(enableReplace)
        this._updateState(state)
      }
    } else {
      state.enabled = true
      state.showReplace = Boolean(enableReplace)
      this._searchAndHighlight()
      this._updateState(state)
      // resetting dirty flags as we do a full search initially
      this._dirty = new Set()
    }
  }

  closeDialog () {
    let state = this._getState()
    if (!state.enabled) return
    state.enabled = false
    this._clearHighlights()
    // Note: recovering the selection here
    this._updateState(state, true)
  }

  setSearchPattern (pattern) {
    let state = this._getState()
    if (state.pattern !== pattern) {
      state.pattern = pattern
      this._searchAndHighlight()
      this._updateState(state)
    }
  }

  setReplacePattern (replacePattern) {
    let state = this._getState()
    if (state.replacePattern !== replacePattern) {
      state.replacePattern = replacePattern
      this._updateState(state)
    }
  }

  toggleCaseSensitivity () {
    this._toggleOption('caseSensitive')
  }

  toggleRegexSearch () {
    this._toggleOption('regexSearch')
  }

  toggleFullWordSearch () {
    this._toggleOption('fullWord')
  }

  _getState () {
    return this._appState.get('findAndReplace') || FindAndReplaceManager.defaultState()
  }

  _toggleOption (optionName) {
    let state = this._getState()
    state[optionName] = !state[optionName]
    if (state.pattern) {
      this._searchAndHighlight()
    }
    this._updateState(state)
  }

  _updateState (state, recoverSelection) {
    const appState = this._appState
    // HACK: touching appState.selection because we want that the applications recovers the selection
    if (recoverSelection) {
      appState._setDirty('selection')
    }
    appState.set('findAndReplace', state)
    appState.propagateUpdates()
  }

  _searchAndHighlight () {
    // re-start the search
    this._clearHighlights()
    this._search()
    this._addHighlights()
  }

  _search () {
    let state = this._getState()
    let matches = new Map()
    let count = 0
    let pattern = state.pattern
    let opts = state
    if (pattern) {
      let tps = this._getTextProperties()
      for (let tp of tps) {
        let _matches = this._searchInProperty(tp, pattern, opts)
        count += _matches.length
        matches.set(String(tp.getPath()), _matches)
      }
    }
    state.matches = matches
    state.count = count
  }

  _updateSearch () {
    let state = this._getState()
    if (!state.enabled || !state.pattern || this._dirty.size === 0) return

    let markersManager = this._markersManager
    let count = state.count
    let matches = state.matches
    let opts = state
    for (let key of this._dirty) {
      let path = key.split(',')
      let _matches = matches.get(key)
      if (_matches) {
        count -= _matches.length
      }
      markersManager.clearPropertyMarkers(path, m => m.type === 'find-marker')
      let tp = this._getTextProperty(key)
      if (tp) {
        _matches = this._searchInProperty(tp, state.pattern, opts)
        count += _matches.length
        matches.set(key, _matches)
        this._addHighlightsForProperty(path, _matches)
      } else {
        matches.delete(key)
      }
    }
    state.count = count
    state.matches = matches
    // HACK: need to make sure that the selection is recovered here
    this._updateState(state, true)
    this._dirty = new Set()
  }

  _searchInProperty (tp, pattern, opts) {
    return _findInText(tp.getText(), pattern, opts)
  }

  _clearHighlights () {
    const markersManager = this._markersManager
    const state = this._getState()
    if (state.matches) {
      state.matches.forEach((_, key) => {
        let path = key.split(',')
        markersManager.clearPropertyMarkers(path, m => m.type === 'find-marker')
      })
    }
  }

  _addHighlights () {
    const state = this._getState()
    if (state.matches) {
      state.matches.forEach((matches, key) => {
        let path = key.split(',')
        this._addHighlightsForProperty(path, matches)
      })
    }
  }

  // TODO: don't know yet how we want to update Markers incrementally
  _addHighlightsForProperty (path, matches) {
    let markersManager = this._markersManager
    matches.forEach(m => {
      markersManager.addPropertyMarker(path, {
        type: 'find-marker',
        start: {
          path,
          offset: m.start
        },
        end: {
          path,
          offset: m.end
        }
      })
    })
  }

  _getTextProperties () {
    // HACK: accessing TextPropertyIndex via private member of markersManager
    return this._markersManager._textProperties.getSorted()
  }

  _getTextProperty (key) {
    // HACK: accessing TextPropertyIndex via private member of markersManager
    return this._markersManager._textProperties.getTextProperty(key)
  }

  _onTextPropertyChanged (path) {
    this._dirty.add(String(path))
  }

  _onDocumentChange () {
    this._updateSearch()
  }

  static defaultState () {
    return {
      enabled: false,
      pattern: '',
      showReplace: false,
      replacePattern: '',
      caseSensitive: false,
      fullWord: false,
      regexSearch: false
    }
  }
}

function _findInText (text, pattern, opts = {}) {
  if (!opts.regexSearch) {
    pattern = pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
  }
  if (opts.fullWord) {
    pattern = '\\b' + pattern + '\\b'
  }
  let matcher = new RegExp(pattern, opts.caseSensitive ? 'g' : 'gi')
  let matches = []
  let match
  while ((match = matcher.exec(text))) {
    matches.push({
      start: match.index,
      end: matcher.lastIndex
    })
  }
  return matches
}
