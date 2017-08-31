import { NodeComponent, FontAwesomeIcon as Icon } from 'substance'

import TextInput from './TextInput'

export default class PersonGroup extends NodeComponent {

  render($$) {
    let authorNames = this.props.node.findAll('name')
    let el = $$('div').addClass('se-authors').append(
      $$('div').addClass('se-label').append('Authors')
    )
  
    authorNames.forEach(author => {
      let surname = author.find('surname')
      let givenName = author.find('given-names')
      let authorEl = $$('div').addClass('se-author se-form').append(
        $$(TextInput, {node: givenName, label: 'Given names'}).ref(givenName.id),
        $$(TextInput, {node: surname, label: 'Surname'}).ref(surname.id),
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

  _addAuthor() {
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

  _removeAuthor(authorId) {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.setSelection(null)
    editorSession.transaction((doc) => {
      let personGroup = doc.get(nodeId)
      let author = personGroup.find(`name#${authorId}`)
      personGroup.removeChild(author)
    })
    //this.rerender()
  }
}
