import { Component } from 'substance'

export default class ArticleReferencesComponent extends Component {

  /*
    TODO: this should work like RefListComponent but using an abstracted ReferencesModel
  */
  render($$) {
    let el = $$('div')
      .addClass('sc-article-references').append(
        'TODO_ARTICLE_REFERENCES'
      )
    return el
  }
}
