import { CustomSurface, Component } from 'substance'

export default class AuthorsListComponent extends CustomSurface {
  getInitialState () {
    let items = this._getAuthors()
    return {
      hidden: items.length === 0,
      edit: false
    }
  }

  didMount () {
    super.didMount()

    const appState = this.context.appState
    // FIXME: it is not good to rerender on every selection change.
    // Instead it should derive a state from the selection, and only rerender if the
    // state has changed (not-selected, selected + author id)
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    super.dispose()
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    let el = $$('div').addClass('sc-authors-list')
    el.append(
      this._renderAuthors($$)
    )
    return el
  }

  _renderAuthors ($$) {
    const sel = this.context.appState.selection
    const authors = this._getAuthors()
    let els = []
    authors.forEach((author, index) => {
      const authorEl = $$(AuthorDisplay, { node: author })
      if (sel && sel.nodeId === author.id) {
        authorEl.addClass('sm-selected')
      }
      els.push(authorEl)
      if (index < authors.length - 1) {
        els.push(', ')
      }
    })
    return els
  }

  _getCustomResourceId () {
    return 'authors-list'
  }

  _getAuthors () {
    return this.props.model.getItems()
  }
}

class AuthorDisplay extends Component {
  render ($$) {
    let el = $$('span').addClass('se-contrib').html(
      this.context.api.renderEntity(this.props.node)
    )
    el.on('mousedown', this._onMousedown)
      .on('click', this._onClick)
    return el
  }

  _onMousedown (e) {
    e.stopPropagation()
    if (e.button === 2) {
      this._select()
    }
  }

  _onClick (e) {
    e.stopPropagation()
    this._select()
  }

  _select () {
    this.context.api.selectEntity(this.props.node.id)
  }
}
