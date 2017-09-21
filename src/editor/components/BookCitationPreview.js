import { Component } from 'substance'
import ElementCitationAuthorsList from './ElementCitationAuthorsList'

export default class BookCitationPreview extends Component {
  render($$) {
    let node = this.props.node
    let source = node.find('source').text()
    let year = node.find('year').text()
    let publisherLoc = node.find('publisher-loc').text()
    let publisherName = node.find('publisher-name').text()

    let el = $$('div').addClass('sc-book-citation-preview')

    el.append(
      source,
      '. ',
      $$(ElementCitationAuthorsList, {node: node}),
      ', editors. ',
      '(',
      year,
      ') ',
      publisherLoc,
      ': ',
      publisherName
    )

    return el
  }
}
