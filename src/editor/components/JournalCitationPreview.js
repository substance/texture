import { Component } from 'substance'
import ElementCitationAuthorsList from './ElementCitationAuthorsList'

export default class JournalCitationPreview extends Component {
  render($$) {
    let node = this.props.node
    let articleTitle = node.find('article-title').text()
    let source = node.find('source').text()
    let year = node.find('year').text()
    let volume = node.find('volume').text()
    let fpage = node.find('fpage').text()
    let lpage = node.find('lpage').text()

    let el = $$('div').addClass('sc-journal-citation-preview')

    el.append(
      $$(ElementCitationAuthorsList, {node: node}),
      '. ',
      year,
      '. ',
      articleTitle,
      '. ',
      source,
      ' ',
      $$('bold').append(
        volume
      ),
      ':',
      fpage,
      '-',
      lpage
    )

    return el
  }
}
