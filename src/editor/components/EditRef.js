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
      this._renderJournalRefForm($$)
    )
  }

  _renderJournalRefForm($$) {
    let el = $$('div').addClass('se-journal-ref')
    
    el.append(
      this._renderArticleTitle($$),
      this._renderAuthors($$),
      this._renderJournalTitle($$),
      this._renderPeriodical($$),
      this._renderPages($$),
      this._renderDOI($$),
      this._renderPMID($$),
      this._renderNote($$)
    )

    return el
  }

  /*
    TODO: implement book reference form
  */
  _renderBookRefForm($$) {
    let el = $$('div').addClass('se-book-ref')
    return el
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

  _renderJournalTitle($$) {
    let journalTitle = this.props.node.find('source')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    return $$('div').addClass('se-journal-title').append(
      $$('div').addClass('se-label').append('Journal Title'),
      $$(TextPropertyEditor, {
        placeholder: 'Journal title',
        path: journalTitle.getTextPath(),
        disabled: this.props.disabled
      }).ref(journalTitle.id).addClass('se-text-input')
    )
  }

  _renderPeriodical($$) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('se-pereodical')
    let form = $$('div').addClass('se-form')

    let volume = this.props.node.find('volume')
    if(volume) {
      form.append(
        $$(TextPropertyEditor, {
          placeholder: 'Volume',
          path: volume.getTextPath(),
          disabled: this.props.disabled
        }).ref(volume.id).addClass('se-text-input')
      )
    }

    let issue = this.props.node.find('issue')
    if(issue) {
      form.append(
        $$(TextPropertyEditor, {
          placeholder: 'Issue',
          path: issue.getTextPath(),
          disabled: this.props.disabled
        }).ref(issue.id).addClass('se-text-input')
      )
    }

    let year = this.props.node.find('year')
    if(year) {
      form.append(
        $$(TextPropertyEditor, {
          placeholder: 'Year',
          path: year.getTextPath(),
          disabled: this.props.disabled
        }).ref(year.id).addClass('se-text-input')
      )
    }

    el.append(
      $$('div').addClass('se-label').append('Volume / Issue / Year'),
      form
    )

    return el
  }

  _renderPages($$) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('se-pages')

    let firstPage = this.props.node.find('fpage')
    let firstPageEditor = $$(TextPropertyEditor, {
      placeholder: 'From',
      path: firstPage.getTextPath(),
      disabled: this.props.disabled
    }).ref(firstPage.id).addClass('se-text-input')

    let lastPage = this.props.node.find('lpage')
    let lastPageEditor = $$(TextPropertyEditor, {
      placeholder: 'To',
      path: lastPage.getTextPath(),
      disabled: this.props.disabled
    }).ref(lastPage.id).addClass('se-text-input')

    el.append(
      $$('div').addClass('se-label').append('Pages (from-to)'),
      $$('div').addClass('se-form').append(
        firstPageEditor,
        lastPageEditor
      )
    )

    return el
  }

  _renderDOI($$) {
    let doi = this.props.node.find('pub-id[pub-id-type=doi]')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    if(doi) {
      return $$('div').addClass('se-doi').append(
        $$('div').addClass('se-label').append('DOI'),
        $$(TextPropertyEditor, {
          placeholder: 'DOI of article',
          path: doi.getTextPath(),
          disabled: this.props.disabled
        }).ref(doi.id).addClass('se-text-input')
      )
    } else {
      return
    }
  }

  _renderPMID($$) {
    let pmid = this.props.node.find('pub-id[pub-id-type=pmid]')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    if(pmid) {
      return $$('div').addClass('se-pmid').append(
        $$('div').addClass('se-label').append('PMID'),
        $$(TextPropertyEditor, {
          placeholder: 'PubMed identifier',
          path: pmid.getTextPath(),
          disabled: this.props.disabled
        }).ref(pmid.id).addClass('se-text-input')
      )
    } else {
      return
    }
  }

  _renderNote($$) {
    let note = this.props.node.find('comment')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    if(note) {
      return $$('div').addClass('se-note').append(
        $$('div').addClass('se-label').append('Note'),
        $$(TextPropertyEditor, {
          placeholder: 'Additional notes',
          path: note.getTextPath(),
          disabled: this.props.disabled
        }).ref(note.id).addClass('se-text-input')
      )
    } else {
      return
    }
  }

  /*
    TODO: Rewrite ElementCitation with new data
  */
  _updateRef() {

  }

}
