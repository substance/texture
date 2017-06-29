import { Component } from 'substance'

export default class ElementCitationComponent extends Component {
  render($$) {
    return $$('div').addClass('sc-element-citation').append(
      this._renderArticleTitle($$),
      this._renderAuthors($$)
    )
  }

  _renderArticleTitle($$) {
    // TODO: use text property so annotations are rendered if present
    let articleTitle = this.props.node.find('article-title')
    return $$('div').addClass('se-article-title').append(
      articleTitle.content
    )
  }

  _renderAuthors($$) {
    return $$('div').addClass('se-authors').append(
      'TODO: render authors and other missing info'
    )
  }

}
