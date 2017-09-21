import { Component } from 'substance'

export default class ElementCitationAuthorsList extends Component {
  render($$) {
    let node = this.props.node
    let authorNames = node.findAll('person-group[person-group-type=author] name')
    let authors = authorNames.map(author => {
      let surname = author.find('surname')
      let givenName = author.find('given-names')
      return givenName.content + ' ' + surname.content
    })
    let authorsString = authors.join(', ')

    let el = $$('span')
      .addClass('sc-element-citation-authors-list')
      .append(authorsString)

    return el
  }
}
