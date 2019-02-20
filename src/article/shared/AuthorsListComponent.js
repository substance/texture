import { CustomSurface } from 'substance'

export default class AuthorsListComponent extends CustomSurface {
  getInitialState () {
    let items = this._getAuthors()
    return {
      hidden: items.length === 0,
      edit: false
    }
  }

  render ($$) {
    let el = $$('div').addClass('sc-authors-list')
    el.append(
      this._renderAuthors($$)
    )
    return el
  }

  _renderAuthors ($$) {
    const authors = this._getAuthors()
    let els = []
    authors.forEach((author, index) => {
      let short = author.type === 'organisation'
      els.push(
        $$('span').addClass('se-contrib').html(
          this.context.api._renderEntity(author, { short })
        )
      )
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
