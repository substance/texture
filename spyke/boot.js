import CiteprocBibliography from './CiteprocBibliography.js'

class App extends substance.Component {
  constructor (...args) {
    super(args)

    this._bibliography = new CiteprocBibliography()
  }

  render ($$) {
    return $$('div').append(
      this._renderCitations($$),
      this._renderBibliography($$)
    )
  }

  _renderCitations ($$) {
    return $$('div').append(
      'Citations:',
      $$('ul').append(
        this._bibliography.getCitations().map(citation => {
          return $$('li').html(citation.html)
        })
      )
    )
  }

  _renderBibliography ($$) {
    return $$('div').append(
      'References:'
    ).append(
      this._bibliography.getReferences().map(entry => {
        return $$('div').ref(entry.id).html(entry.html)
      })
    )
  }

  _renderItem ($$) {
    return $$('div').addClass('foo').text('bar')
  }
}

App.mount(window.document.getElementById('root'))
