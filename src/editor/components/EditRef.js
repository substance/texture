import { Component, FontAwesomeIcon as Icon } from 'substance'
const refTypes = [
  {id: 'joural', label: 'Journal article'},
  {id: 'book', label: 'Book chapter'},
]

export default class EditRef extends Component {

  /*
    TODO:
      - Add missing forms
      - We need different forms for different ref types
      - Implement only publication-type="journal" and publication-type="book"
  */
  render($$) {
    let elementCitation = this.props.node.find('element-citation')
    let publicationType = elementCitation.getAttribute('publication-type')
    let el = $$('div').addClass('sc-edit-ref')

    if(publicationType === 'journal') {
      el.append(this._renderJournalRefForm($$))
    } else if (publicationType === 'book') {
      el.append(this._renderBookRefForm($$))
    } else {
      el.append(`Editing of the publication type ${publicationType} is not yet supported in this Alpha version.`)
    }
    return el
  }

  _renderJournalRefForm($$) {
    let el = $$('div').addClass('se-journal-ref')

    el.append(
      this._renderRefTypeSwitcher($$),
      this._renderArticleTitle($$),
      this._renderAuthors($$),
      this._renderSource($$, 'Jounal Title'),
      this._renderPeriodical($$),
      this._renderElocation($$),
      this._renderPages($$),
      this._renderDOI($$),
      this._renderPMID($$),
      this._renderComment($$)
    )

    return el
  }

  _renderBookRefForm($$) {
    let el = $$('div').addClass('se-book-ref')

    el.append(
      this._renderRefTypeSwitcher($$),
      this._renderSource($$, 'Book Title'),
      this._renderAuthors($$),
      this._renderChapterTitle($$),
      this._renderPublisherLocation($$),
      this._renderPublisherName($$),
      this._renderPublishingYear($$),
      this._renderPages($$),
      this._renderComment($$)
    )

    return el
  }

  _renderRefTypeSwitcher($$) {
    let elementCitation = this.props.node.find('element-citation')
    let publicationType = elementCitation.getAttribute('publication-type')
    let el = $$('div').addClass('se-ref-type')

    let switcher = $$('select').on('change', this._onRefTypeChange)
    refTypes.forEach(refType => {
      let option = $$('option').attr('value', refType.id).append(refType.label)
      if(publicationType === refType.id) option.attr('selected', 'selected')
      switcher.append(option)
    })

    el.append(
      $$('div').addClass('se-label').append('Type'),
      $$('div').addClass('se-select').append(switcher)
    )

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
    let authorNames = this.props.node.findAll('person-group[person-group-type=author] name')
    let el = $$('div').addClass('se-authors').append(
      $$('div').addClass('se-label').append('Authors')
    )

    authorNames.forEach(author => {
      let surname = author.find('surname')
      let givenName = author.find('given-names')
      let authorEl = $$('div').addClass('se-author se-form').append(
        this._renderTextElement($$, givenName, 'Given names'),
        this._renderTextElement($$, surname, 'Surname'),
        $$(Icon, {icon: 'fa-trash'})
          .addClass('se-remove-author')
          .on('click', this._removeAuthor.bind(this, author.id))
      )
      el.append(authorEl)
    })

    el.append(
      $$('button').addClass('sg-big-button')
        .append('Add Author')
        .on('click', this._addAuthor)
    )

    return el
  }

  _renderSource($$, label) {
    let source = this.props.node.find('source')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    return $$('div').addClass('se-source').append(
      $$('div').addClass('se-label').append(label),
      $$(TextPropertyEditor, {
        placeholder: label,
        path: source.getTextPath(),
        disabled: this.props.disabled
      }).ref(source.id).addClass('se-text-input')
    )
  }

  _renderChapterTitle($$) {
    let chapterTitle = this.props.node.find('chapter-title')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    if(chapterTitle) {
      return $$('div').addClass('se-chapter-title').append(
        $$('div').addClass('se-label').append('Chapter Title'),
        $$(TextPropertyEditor, {
          placeholder: 'Chapter title',
          path: chapterTitle.getTextPath(),
          disabled: this.props.disabled
        }).ref(chapterTitle.id).addClass('se-text-input')
      )
    } else {
      return
    }
  }

  _renderPublisherLocation($$) {
    let publisherLoc = this.props.node.find('publisher-loc')

    if(publisherLoc) {
      return $$('div').addClass('se-chapter-title').append(
        $$('div').addClass('se-label').append('Publisher Location'),
        this._renderTextElement($$, publisherLoc, 'Publisher location')
      )
    } else {
      return
    }
  }

  _renderPublisherName($$) {
    let publisherName = this.props.node.find('publisher-name')

    if(publisherName) {
      return $$('div').addClass('se-chapter-title').append(
        $$('div').addClass('se-label').append('Publisher Name'),
        this._renderTextElement($$, publisherName, 'Publisher name')
      )
    } else {
      return
    }
  }

  _renderPublishingYear($$) {
    let publisherYear = this.props.node.find('year')

    if(publisherYear) {
      return $$('div').addClass('se-chapter-title').append(
        $$('div').addClass('se-label').append('Publishing Year'),
        this._renderTextElement($$, publisherYear, 'Publisher year', 'number')
      )
    } else {
      return
    }
  }

  _renderElocation($$) {
    let el = $$('div').addClass('se-elocation')
    let form = $$('div').addClass('se-form')
    let elocationId = this.props.node.find('elocation-id')

    form.append(
      this._renderTextElement($$, elocationId, 'Electronic Location Identifier')
    )

    el.append(
      $$('div').addClass('se-label').append('Electronic Location Identifier'),
      form
    )

    return el
  }

  _renderPeriodical($$) {
    let el = $$('div').addClass('se-pereodical')
    let form = $$('div').addClass('se-form')

    let volume = this.props.node.find('volume')
    let issue = this.props.node.find('issue')
    let year = this.props.node.find('year')

    form.append(
      this._renderTextElement($$, volume, 'Volume')
    )
    form.append(
      this._renderTextElement($$, issue, 'Issue')
    )
    form.append(
      this._renderTextElement($$, year, 'Year')
    )

    el.append(
      $$('div').addClass('se-label').append('Volume / Issue / Year'),
      form
    )

    return el
  }

  _renderPages($$) {
    let el = $$('div').addClass('se-pages')

    let firstPage = this.props.node.find('fpage')
    let firstPageEditor = this._renderTextElement($$, firstPage, 'From')

    let lastPage = this.props.node.find('lpage')
    let lastPageEditor = this._renderTextElement($$, lastPage, 'To')

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

    if(doi) {
      return $$('div').addClass('se-doi').append(
        $$('div').addClass('se-label').append('DOI'),
        this._renderTextElement($$, doi, 'DOI of article')
      )
    } else {
      return
    }
  }

  _renderPMID($$) {
    let pmid = this.props.node.find('pub-id[pub-id-type=pmid]')

    if(pmid) {
      return $$('div').addClass('se-pmid').append(
        $$('div').addClass('se-label').append('PMID'),
        this._renderTextElement($$, pmid, 'PubMed identifier')
      )
    } else {
      return
    }
  }

  _renderComment($$) {
    let comment = this.props.node.find('comment')
    let TextPropertyEditor = this.getComponent('text-property-editor')

    if(comment) {
      return $$('div').addClass('se-comment').append(
        $$('div').addClass('se-label').append('Comment'),
        $$(TextPropertyEditor, {
          placeholder: 'Additional comments',
          path: comment.getTextPath(),
          disabled: this.props.disabled
        }).ref(comment.id).addClass('se-text-input')
      )
    } else {
      return
    }
  }

  _renderTextElement($$, node, placeholder) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$(TextPropertyEditor, {
      placeholder: placeholder,
      path: node.getTextPath(),
      disabled: this.props.disabled
    }).ref(node.id).addClass('se-text-input')

    return el
  }

  _addAuthor() {
    const node = this.props.node
    const personGroupId = node.find('person-group[person-group-type=author]').id
    const editorSession = this.context.editorSession
    editorSession.setSelection(null)
    editorSession.transaction((doc) => {
      let personGroup = doc.get(personGroupId)
      let name = doc.createElement('name').append(
        doc.createElement('given-names'),
        doc.createElement('surname')
      )
      personGroup.append(name)
    })

    this.rerender()
  }

  _removeAuthor(authorId) {
    const node = this.props.node
    const personGroupId = node.find('person-group[person-group-type=author]').id
    const editorSession = this.context.editorSession
    editorSession.setSelection(null)
    editorSession.transaction((doc) => {
      let personGroup = doc.get(personGroupId)
      let author = personGroup.find(`name#${authorId}`)
      personGroup.removeChild(author)
    })
    this.rerender()
  }

  _onRefTypeChange() {
    alert('Switching the publication type is not yet supported in this Alpha version.') // eslint-disable-line
  }

  /*
    This updates a text node with new text
  */
  _onUpdateTextElement(nodeId) {
    let newValue = this.refs[nodeId].val()
    let editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let element = doc.get(nodeId)
      element.setText(newValue)
      doc.setSelection(null)
    })
    // Trigger custom ref:updated which leads to an update of the rendered
    // record (see RefComponent)
    editorSession.emit('ref:updated', this.props.node.id)
  }

}
