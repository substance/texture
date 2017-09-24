import { NodeComponent } from 'substance'
import TextInput from './TextInput'
import Button from './Button'

export default class PersonGroup extends NodeComponent {

  render($$) {
    let label = this.props.label
    let personNames = this.props.node.findAll('name')
    let el = $$('div').addClass('sc-person-group').append(
      $$('div').addClass('se-label').append(label)
    )

    personNames.forEach(person => {
      let surname = person.find('surname')
      let givenName = person.find('given-names')
      let personEl = $$('div').addClass('se-author').append(
        $$(TextInput, {node: givenName, label: 'Given names'}).ref(givenName.id),
        $$(TextInput, {node: surname, label: 'Surname'}).ref(surname.id),
        $$(Button, {icon: 'trash', tooltip: 'remove'}).addClass('se-remove-author')
          .on('click', this._removePerson.bind(this, person.id))
      )
      el.append(personEl)
    })

    el.append(
      $$(Button, {style: 'big', label: 'Add Person'})
        .on('click', this._addPerson)
    )

    return el
  }

  _addPerson() {
    const node = this.props.node
    const personGroupId = node.id
    const editorSession = this.context.editorSession
    editorSession.setSelection(null)
    editorSession.transaction((doc) => {
      let personGroup = doc.get(personGroupId)
      let name = doc.createElement('name').append(
        doc.createElement('surname'),
        doc.createElement('given-names')
      )
      personGroup.append(name)
    })
    //this.rerender()
  }

  _removePerson(personId) {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.setSelection(null)
    editorSession.transaction((doc) => {
      let personGroup = doc.get(nodeId)
      let person = personGroup.find(`name#${personId}`)
      personGroup.removeChild(person)
    })
    //this.rerender()
  }
}
