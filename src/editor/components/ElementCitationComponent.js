import { Component, TextPropertyComponent } from 'substance'

export default class ElementCitationComponent extends Component {
  render($$) {
    let elementCitation = this.props.node
    let publicationType = elementCitation.getAttribute('publication-type')

    let el = $$('div').addClass('sc-element-citation').append(
      this._renderTitle($$),
      this._renderAuthorsAndYear($$)
    )

    if(publicationType === 'journal') {
      el.append(
        this._renderJournalData($$),
        this._renderDOILink($$),
        this._renderScholarLinks($$)
      )
    } else if (publicationType === 'book') {
      el.append(this._renderBookData($$))
    }

    return el
  }

  _renderTitle($$) {
    let articleTitle = this.props.node.find('article-title')
    let chapterTitle = this.props.node.find('chapter-title')

    if(articleTitle) {
      return $$(TextPropertyComponent, {
        path: articleTitle.getPath()
      }).ref(articleTitle.id).addClass('se-article-title')
    } else if(chapterTitle) {
      return $$(TextPropertyComponent, {
        path: chapterTitle.getPath()
      }).ref(chapterTitle.id).addClass('se-chapter-title')
    } else {
      return
    }
  }

  _renderAuthorsAndYear($$) {
    let authorNames = this.props.node.findAll('person-group[person-group-type=author] name')
    let year = this.props.node.find('year')

    let authors = authorNames.map(author => {
      let surname = author.find('surname')
      let givenName = author.find('given-names')

      return givenName.content + ' ' + surname.content
    })

    let authorsString = authors.join(', ')
    if(year) authorsString += ' (' + year.content + ')'

    return $$('div').addClass('se-authors').append(authorsString)
  }

  _renderJournalData($$) {
    let source = this.props.node.find('source')
    let volume = this.props.node.find('volume')
    let issue = this.props.node.find('issue')
    let fpage = this.props.node.find('fpage')
    let lpage = this.props.node.find('lpage')

    let journalEl = $$('div').addClass('se-journal-data')

    if(source) {
      journalEl.append(
        $$('em').addClass('se-journal-name').append(source.content + ' ')
      )
    }

    if(volume) {
      journalEl.append(
        $$('strong').addClass('se-journal-volume').append(volume.content)
      )
    }

    if(issue) {
      journalEl.append(
        $$('strong').addClass('se-journal-issue').append('.' + issue.content)
      )
    }

    if(fpage) {
      journalEl.append(':' + fpage.content)

      if(lpage) {
        journalEl.append('-' + lpage.content)
      } else {
        journalEl.append('.')
      }
    }

    return journalEl
  }

  _renderBookData($$) {
    let source = this.props.node.find('source')
    let publisherLoc = this.props.node.find('publisher-loc')
    let publisherName = this.props.node.find('publisher-name')
    let fpage = this.props.node.find('fpage')
    let lpage = this.props.node.find('lpage')

    let bookEl = $$('div').addClass('se-book-data')

    if(source) {
      bookEl.append(
        $$('em').addClass('se-book-name').append(source.content)
      )
    }

    if(fpage) {
      bookEl.append(': p.' + fpage.content)

      if(lpage) {
        bookEl.append('-' + lpage.content)
      }
    }

    if(publisherName) {
      let publisherEl = $$('div').addClass('se-publisher-data')
      publisherEl.append(publisherName.content)

      if(publisherLoc) {
        publisherEl.append(', ' + publisherLoc.content)
      }

      bookEl.append(publisherEl)
    }

    return bookEl
  }

  _renderDOILink($$) {
    let doi = this.props.node.find('pub-id[pub-id-type=doi]')

    if(doi) {
      return $$('a').addClass('se-doi-link')
        .attr({target: '_blank', href: 'https://doi.org/' + doi.content})
        .append('https://doi.org/' + doi.content)
    } else {
      return
    }
  }

  _renderScholarLinks($$) {
    let pmid = this.props.node.find('pub-id[pub-id-type=pmid]')
    let articleTitle = this.props.node.find('article-title')
    let el = $$('div').addClass('se-scholar-links')

    if(pmid) {
      el.append(
        $$('a').addClass('se-pubmed-link')
          .attr({target: '_blank', href: 'https://www.ncbi.nlm.nih.gov/pubmed/' + pmid.content})
          .append('PubMed'),
        ' | '
      )
    }

    el.append(
      $$('a').addClass('se-google-scholar-link')
        .attr({target: '_blank', href: 'https://scholar.google.com/scholar_lookup?title=' + articleTitle.content})
        .append('Google Scholar')
    )

    return el
  }

}
