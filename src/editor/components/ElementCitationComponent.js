import { Component } from 'substance'

import ElementCitationTitle from './ElementCitationTitle'
import ElementCitationAuthorsAndYear from './ElementCitationAuthorsAndYear'

export default class ElementCitationComponent extends Component {

  render($$) {
    let node = this.props.node
    let publicationType = node.getAttribute('publication-type')

    let el = $$('div').addClass('sc-element-citation').append(
      $$(ElementCitationTitle, { node }),
      $$(ElementCitationAuthorsAndYear, { node })
    )

    if(publicationType === 'journal') {
      el.append(
        this._renderJournalData($$)
      )
    } else if (publicationType === 'book') {
      el.append(this._renderBookData($$))
    }

    return el
  }

  _renderJournalData($$) {
    let source = this.props.node.find('source')
    let volume = this.props.node.find('volume')
    let issue = this.props.node.find('issue')
    let fpage = this.props.node.find('fpage')
    let lpage = this.props.node.find('lpage')

    let journalEl = $$('div').addClass('se-journal-data')

    if(source) {
      if(source.content !== '') {
        journalEl.append(
          $$('em').addClass('se-journal-name').append(source.content + ' ')
        )
      }
    }

    if(volume) {
      if(volume.content !== '') {
        journalEl.append(
          $$('strong').addClass('se-journal-volume').append(volume.content)
        )
      }
    }

    if(issue) {
      if(issue.content !== '') {
        journalEl.append(
          $$('strong').addClass('se-journal-issue').append('.' + issue.content)
        )
      }
    }

    if(fpage) {
      if(fpage.content !== '') {
        journalEl.append(':' + fpage.content)

        if(lpage) {
          if(lpage.content !== '') {
            journalEl.append('-' + lpage.content)
          } else {
            journalEl.append('.')
          }
        }
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


}
