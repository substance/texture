import { Component } from 'substance'

export default class PersonGroupPreview extends Component {
  render($$) {
    let node = this.props.node
    let type = this.props.type
    let label = this.props.label

    let personNames = node.findAll('person-group[person-group-type=' + type + '] name')
    let persons = personNames.map(person => {
      let surname = person.find('surname')
      let givenName = person.find('given-names')
      return givenName.content + ' ' + surname.content
    })
    let personsString = persons.join(', ')

    let el = $$('span')
      .addClass('sc-person-group-preview')

    if(persons.length > 0) {
      el.append(personsString)
    } else {
      el.addClass('sm-placeholder').append(label)
    }

    return el
  }
}
