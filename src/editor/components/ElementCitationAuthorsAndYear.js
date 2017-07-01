import { Component } from 'substance'

export default class ElementCitationAuthorsAndYear extends Component {

  render($$) {
    let el = $$(this.props.tagName || 'div').addClass('sc-element-citation-authors-and-year')
    let authorNames = this.props.node.findAll('person-group[person-group-type=author] name')
    let year = this.props.node.find('year')
    let authors = authorNames.map(author => {
      let surname = author.find('surname')
      let givenName = author.find('given-names')
      return givenName.content + ' ' + surname.content
    })
    let authorsString = authors.join(', ')
    if(year) {
      if(year.content !== '') authorsString += ' (' + year.content + ')'
    }
    el.append(authorsString)
    return el
  }

}
