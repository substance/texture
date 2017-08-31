import { Component } from 'substance'
import ContentLoc from './ContentLoc'
import TextInput from './TextInput'
import PersonGroup from './PersonGroup'

export default class JournalCitation extends Component {

  render($$) {
    let el = $$('div').addClass('sc-journal-citation')

    let articleTitle = this.props.node.find('article-title')
    let source = this.props.node.find('source')
    let personGroup = this.props.node.find('person-group')
    let contentLoc = this.props.node.find('content-loc')
    let comment = this.props.node.find('comment')

    let year = this.props.node.find('year')
    let issue = this.props.node.find('issue')
    let volume = this.props.node.find('volume')

    el.append(
      $$(TextInput, { node: articleTitle, label: 'Article Title' }),
      $$(PersonGroup, { node: personGroup }),
      $$(TextInput, { node: source, label: 'Journal Title' }),
      $$(TextInput, { node: volume, label: 'Volume' }),
      $$(TextInput, { node: issue, label: 'Issue' }),
      $$(TextInput, { node: year, label: 'Year' }),
      $$(TextInput, { node: comment, label: 'Comment' }),
      $$(ContentLoc, { node: contentLoc })
      // TODO: edit pub-ids (doi, pmid)
    )
    return el
  }
}
