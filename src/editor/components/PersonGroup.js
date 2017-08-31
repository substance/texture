import { Component } from 'substance'

export default class PersonGroup extends Component {

  render($$) {
    return $$('div').append('TODO: implement person-group editing')
  }

  // _renderAuthors($$) {
  //   let authorNames = this.props.node.findAll('person-group[person-group-type=author] name')
  //   let el = $$('div').addClass('se-authors').append(
  //     $$('div').addClass('se-label').append('Authors')
  //   )
  //
  //   authorNames.forEach(author => {
  //     let surname = author.find('surname')
  //     let givenName = author.find('given-names')
  //     let authorEl = $$('div').addClass('se-author se-form').append(
  //       this._renderTextElement($$, givenName, 'Given names'),
  //       this._renderTextElement($$, surname, 'Surname'),
  //       $$(Icon, {icon: 'fa-trash'})
  //         .addClass('se-remove-author')
  //         .on('click', this._removeAuthor.bind(this, author.id))
  //     )
  //     el.append(authorEl)
  //   })
  //
  //   el.append(
  //     $$('button').addClass('sg-big-button')
  //       .append('Add Author')
  //       .on('click', this._addAuthor)
  //   )
  //
  //   return el
  // }

  // _addAuthor() {
  //   const node = this.props.node
  //   const personGroupId = node.find('person-group[person-group-type=author]').id
  //   const editorSession = this.context.editorSession
  //   editorSession.setSelection(null)
  //   editorSession.transaction((doc) => {
  //     let personGroup = doc.get(personGroupId)
  //     let name = doc.createElement('name').append(
  //       doc.createElement('surname'),
  //       doc.createElement('given-names')
  //     )
  //     personGroup.append(name)
  //   })
  //   this.rerender()
  // }
  //
  // _removeAuthor(authorId) {
  //   const node = this.props.node
  //   const personGroupId = node.find('person-group[person-group-type=author]').id
  //   const editorSession = this.context.editorSession
  //   editorSession.setSelection(null)
  //   editorSession.transaction((doc) => {
  //     let personGroup = doc.get(personGroupId)
  //     let author = personGroup.find(`name#${authorId}`)
  //     personGroup.removeChild(author)
  //   })
  //   this.rerender()
  // }
}
