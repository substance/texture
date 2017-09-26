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
    let edition = this.props.node.find('edition')
    let authorsGroup = this.props.node.find('person-group[person-group-type="author"]')
    let editorsGroup = this.props.node.find('person-group[person-group-type="editor"]')
    let contentLoc = this.props.node.find('content-loc')
    let comment = this.props.node.find('comment')
    let publisherLoc = this.props.node.find('publisher-loc')
    let publisherName = this.props.node.find('publisher-name')
    let year = this.props.node.find('year')

    el.append(
      $$(TextInput, { node: source, label: 'Book Title' }),
      $$(TextInput, { node: articleTitle, label: 'Chapter Title' }),
      $$(TextInput, { node: edition, label: 'Edition' }),
      $$(PersonGroup, { node: authorsGroup, label: 'Authors' }),
      $$(PersonGroup, { node: editorsGroup, label: 'Editors' }),
      $$(TextInput, { node: publisherLoc, label: 'Publisher Location' }),
      $$(TextInput, { node: publisherName, label: 'Publisher Name' }),
      $$(TextInput, { node: year, label: 'Year' }),
      $$(ContentLoc, { node: contentLoc }),
      $$(TextInput, { node: comment, label: 'Comment' }),
      $$(EditPubIdsComponent, { node: this.props.node })
    )
    return el
  }
}
