export default class FindAndReplaceManager {
  constructor (appState, markersManager) {
    this._appState = appState
    this._markersManager = markersManager
  }

  showDialog (enableReplace) {
    console.log('AAAA')
    enableReplace = Boolean(enableReplace)
    // TODO: think about mutual
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
    }
  }

  hideDialog () {
    let state = this._getState()
    if (!state.enabled) return
    state.enabled = false
    this._updateState(state)
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

  toggleFullWordMode () {
    this._toggleOption('fullWord')
  }

  _getState () {
    return this._appState.get('findAndReplace') || FindAndReplaceManager.defaultState()
  }

  _toggleOption (optionName) {
    let state = this._getState()
    if (state.pattern) {
      state[optionName] = !state[optionName]
      this._searchAndHighlight()
      this._updateState()
    }
  }

  _updateState (state) {
    this._appState.set('findAndReplace', state)
    this._appState.propagateUpdates()
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
    return this._markersManager._textProperties.getSorted()
  }

  static defaultState () {
    return {
      enabled: false,
      pattern: '',
      showReplace: false,
      replacePattern: '',
      caseSensitive: false,
      fullWord: false
    }
  }
}

function _findInText (text, pattern, opts = {}) {
  if (!opts.regexSearch) {
    pattern = pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
  }
  if (opts.fullWord) {
    pattern = '\b' + pattern + '\b'
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
