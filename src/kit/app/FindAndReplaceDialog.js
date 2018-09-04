import { debounce, Component, keys } from 'substance'

export default class FindAndReplaceDialog extends Component {
  didMount () {
    this.context.appState.addObserver(['findAndReplace'], this.rerender, this, { stage: 'render' })
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
    return el
  }

  _renderFindSection ($$) {
    const Button = this.getComponent('button')
    return $$('div').addClass('se-section').addClass('sm-find').append(
      // TODO use Button Component
      $$('div').addClass('se-group sm-options').append(
        $$(Button).addClass('sm-regex-search').append('.*'),
        $$(Button).addClass('sm-case-sensitive').append('Aa'),
        $$(Button).addClass('sm-case-sensitive').append('|Abc|')
      ),
      $$('div').addClass('se-group sm-input').append(
        $$('div').addClass('se-label').append(this.getLabel('find')),
        this._renderPatternInput($$),
        this._renderStatusCounter($$)
      ),
      $$('div').addClass('se-group sm-actions').append(
        // TODO: use Button Component
        $$('button').addClass('sm-next')
          .append(this.getLabel('next'))
          .on('click', this._findNext),
        $$('button').addClass('sm-previous')
          .append(this.getLabel('previous'))
          .on('click', this._findPrevious),
        $$('button').addClass('sm-close')
          .append(this.getLabel('close'))
          .on('click', this._close)
      )
    )
  }

  _renderReplaceSection ($$) {
    let state = this._getState()
    if (state.showReplace) {
      return $$('div').addClass('se-section').addClass('sm-replace').append(
        $$('div').addClass('se-group sm-options').append(),
        $$('div').addClass('se-group sm-input').append(
          this._renderReplacePatternInput($$)
        ),
        // TODO: use Button Component
        $$('div').addClass('se-group sm-actions').append(
          $$('button').addClass('sm-replace')
            .append(this.getLabel('replace'))
            .on('click', this._replaceNext),
          $$('button').addClass('sm-replace-all')
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
      .on('input', debounce(this._updatePattern, 300))
  }

  _renderReplacePatternInput ($$) {
    let state = this._getState()
    return $$('input').ref('replacePattern')
      .attr({
        type: 'text',
        'tabindex': 500
      })
      .val(state.replacePattern)
      .on('input', debounce(this._updateReplacePattern, 300))
  }

  _renderStatusCounter ($$) {
    let state = this._getState()
    if (state.count > 0) {
      return $$('span').addClass('se-status-counter').append(
        ['?', state.count].join(' / ')
      )
    }
  }

  _getState () {
    return this.context.appState.get('findAndReplace')
  }

  _getManager () {
    return this.context.findAndReplaceManager
  }

  _close () {
    this._getManager().hideDialog()
  }

  _findNext () {
    console.error('TODO: findNext()')
  }

  _findPrevious () {
    console.error('TODO: findPrevious()')
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

  _onKeydown (e) {
    if (e.keycode === keys.ESC) {
      e.stopPropagation()
      e.preventDefault()
      this._close()
    }
  }

  _onPatternKeydown (e) {
    if (e.keycode === keys.ENTER) {
      e.stopPropagation()
      e.preventDefault()
      this._findNext()
    }
  }
}
