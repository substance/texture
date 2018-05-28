import { Component } from 'substance'

export default class ArticleHeaderComponent extends Component {

  render($$) {
    let el = $$('div')
      .addClass('sc-article-header').append(
        'TODO_ARTICLE_HEADER'
      )
    return el
  }
}
