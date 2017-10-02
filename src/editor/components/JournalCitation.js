import { Component } from 'substance'
import ContentLoc from './ContentLoc'
import TextInput from './TextInput'
import PersonGroup from './PersonGroup'
import EditPubIdsComponent from './EditPubIdsComponent'

export default class JournalCitation extends Component {

  render($$) {
    let el = $$('div').addClass('sc-journal-citation')
    let articleTitle = this.props.node.find('article-title')
    let source = this.props.node.find('source')
    let authorsGroup = this.props.node.find('person-group[person-group-type="author"]')
    let editorsGroup = this.props.node.find('person-group[person-group-type="editor"]')
    let contentLoc = this.props.node.find('content-loc')
    let comment = this.props.node.find('comment')
    let year = this.props.node.find('year')
    let issue = this.props.node.find('issue')
    let volume = this.props.node.find('volume')

    el.append(
      $$(TextInput, { node: articleTitle, label: 'Article Title' }),
      $$(PersonGroup, { node: authorsGroup, label: 'Authors' }),
      $$(PersonGroup, { node: editorsGroup, label: 'Editors' }),
      $$(TextInput, { node: source, label: 'Journal Title' }),
      $$(TextInput, { node: volume, label: 'Volume' }),
      $$(TextInput, { node: issue, label: 'Issue' }),
      $$(TextInput, { node: year, label: 'Year' }),
      $$(TextInput, { node: comment, label: 'Comment' }),
      $$(ContentLoc, { node: contentLoc }),
      $$(EditPubIdsComponent, { node: this.props.node })
    )
    return el
  }
}
