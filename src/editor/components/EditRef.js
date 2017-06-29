import { Component } from 'substance'

export default class EditRef extends Component {

  /*
    TODO:
      - Add missing forms
      - We need different forms for different ref types
      - Implement only publication-type="journal" and publication-type="book"
  */
  render($$) {
    return $$('div').addClass('sc-edit-ref').append(
      this._renderArticleTitle($$)
    )
  }

  _renderArticleTitle($$) {
    let articleTitle = this.props.node.find('article-title')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    return $$('div').addClass('se-article-title').append(
      $$('div').addClass('se-label').append('Article Title'),
      $$(TextPropertyEditor, {
        placeholder: 'Article title',
        path: articleTitle.getTextPath(),
        disabled: this.props.disabled
      }).ref(articleTitle.id).addClass('se-text-input')
    )
  }

  _renderAuthors($$) {
    return $$('div').addClass('se-authors').append(
      'TODO: edit authors'
    )
    // let authorNames = elementCitation.findAll('person-group[person-group-type=author] name')
    // TODO: Render editors for author data, including add new author functionality
  }

  /*
    TODO: Rewrite ElementCitation with new data
  */
  _updateRef() {

  }

}
