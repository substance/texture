import { debounce, Component, keys } from 'substance'

const UPDATE_DELAY = 300

export default class FindAndReplaceDialog extends Component {
  constructor (...args) {
    super(...args)

    // debounce updates when patterns change
    this._updatePattern = debounce(this._updatePattern.bind(this), UPDATE_DELAY)
    this._updateReplacePattern = debounce(this._updateReplacePattern.bind(this), UPDATE_DELAY)
  }

  didMount () {
    this.context.appState.addObserver(['findAndReplace'], this._onUpdate, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    let state = this._getState()
    let el = $$('div').addClass('sc-find-and-replace-dialog')
    el.append(
      this._renderFindSection($$),
      this._renderReplaceSection($$)
    )
    if (!state.enabled) {
      el.addClass('sm-hidden')
    }
    el.on('keydown', this._onKeydown)
    return el
  }

  _renderFindSection ($$) {
    const state = this._getState()
    const Button = this.getComponent('button')
    return $$('div').addClass('se-section').addClass('sm-find').append(
      $$('div').addClass('se-group sm-input').append(
        $$('div').addClass('se-label').append(this.getLabel('find')),
        this._renderPatternInput($$)
      ),
      $$('div').addClass('se-group sm-options').append(
        $$(Button, {
          tooltip: this.getLabel('find-case-sensitive'),
          active: state.caseSensitive,
          theme: this.props.theme
        }).addClass('sm-case-sensitive').append('Aa')
          .on('click', this._toggleCaseSensitivity),
        $$(Button, {
          tooltip: this.getLabel('find-whole-word'),
          active: state.fullWord,
          theme: this.props.theme
        }).addClass('sm-whole-word').append('Abc|')
          .on('click', this._toggleFullWordSearch),
        $$(Button, {
          tooltip: this.getLabel('find-regex'),
          active: state.regexSearch,
          theme: this.props.theme
        }).addClass('sm-regex-search').append('.*')
          .on('click', this._toggleRegexSearch)
      ),
      $$('div').addClass('se-group sm-actions').append(
        this._renderStatus($$),
        $$(Button, {
          tooltip: this.getLabel('find-next'),
          theme: this.props.theme,
          disabled: state.count < 1
        }).addClass('sm-next')
          .append(this.getLabel('next'))
          .on('click', this._findNext),
        $$(Button, {
          tooltip: this.getLabel('find-previous'),
          theme: this.props.theme,
          disabled: state.count < 1
        }).addClass('sm-previous')
          .append(this.getLabel('previous'))
          .on('click', this._findPrevious),
        $$(Button, {
          tooltip: this.getLabel('close'),
          theme: this.props.theme
        }).addClass('sm-close')
          .append('x')
          .on('click', this._close)
      )
    )
  }

  _renderReplaceSection ($$) {
    let state = this._getState()
    if (state.showReplace) {
      const Button = this.getComponent('button')
      return $$('div').addClass('se-section').addClass('sm-replace').append(
        $$('div').addClass('se-group sm-input').append(
          $$('div').addClass('se-label').append(this.getLabel('replace')),
          this._renderReplacePatternInput($$)
        ),
        $$('div').addClass('se-group sm-options').append(),
        $$('div').addClass('se-group sm-actions').append(
          $$(Button, {
            tooltip: this.getLabel('replace'),
            theme: this.props.theme
          }).addClass('sm-replace')
            .append(this.getLabel('replace'))
            .on('click', this._replaceNext),
          $$(Button, {
            tooltip: this.getLabel('replace-all'),
            theme: this.props.theme
          }).addClass('sm-replace-all')
            .append(this.getLabel('replace-all'))
            .on('click', this._replaceAll)
        )
      )
    }
  }

  _renderPatternInput ($$) {
    let state = this._getState()
    return $$('input').ref('pattern')
      .attr({
        type: 'text',
        'tabindex': 500
      })
      .val(state.pattern)
      .on('keydown', this._onPatternKeydown)
      .on('input', this._updatePattern)
  }

  _renderReplacePatternInput ($$) {
    let state = this._getState()
    return $$('input').ref('replacePattern')
      .attr({
        type: 'text',
        'tabindex': 500
      })
      .val(state.replacePattern)
      .on('input', this._updateReplacePattern)
  }

  _renderStatus ($$) {
    let state = this._getState()
    let el = $$('span').addClass('se-status')
    if (state.count > 0) {
      el.append(
        [String(state.cursor+1), state.count].join(' / ')
      )
    } else if (state.pattern) {
      el.append(this.getLabel('no-result'))
    }
    return el
  }

  _grabFocus () {
    let state = this._getState()
    let input = state.showReplace ? this.refs.replacePattern : this.refs.pattern
    input.el.focus()
  }

  _getState () {
    return this.context.appState.get('findAndReplace')
  }

  _getManager () {
    return this.context.findAndReplaceManager
  }

  _close () {
    this._getManager().closeDialog()
  }

  _findNext () {
    this._getManager().next()
  }

  _findPrevious () {
    this._getManager().previous()
  }

  _replaceNext () {
    console.error('TODO: replaceNext()')
  }

  _replaceAll () {
    console.error('TODO: replaceAll()')
  }

  _updatePattern () {
    this._getManager().setSearchPattern(this.refs.pattern.val())
  }

  _updateReplacePattern () {
    this._getManager().setSearchPattern(this.refs.replacePattern.val())
  }

  _toggleCaseSensitivity () {
    this._getManager().toggleCaseSensitivity()
  }

  _toggleFullWordSearch () {
    this._getManager().toggleFullWordSearch()
  }

  _toggleRegexSearch () {
    this._getManager().toggleRegexSearch()
  }

  _onUpdate () {
    // if this dialog is made visible, auto-focus the respective pattern input field
    // TODO: maybe we should let the app control this
    let wasHidden = this.el.hasClass('sm-hidden')
    this.rerender()
    let isHidden = this.el.hasClass('sm-hidden')
    if (wasHidden && !isHidden) {
      this._grabFocus()
    }
  }

  _onKeydown (e) {
    if (e.keyCode === keys.ESCAPE) {
      e.stopPropagation()
      e.preventDefault()
      this._close()
    }
  }

  _onPatternKeydown (e) {
    if (e.keyCode === keys.ENTER) {
      e.stopPropagation()
      e.preventDefault()
      this._findNext()
    }
  }
}
