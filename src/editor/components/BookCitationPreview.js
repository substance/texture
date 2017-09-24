import { Component } from 'substance'
import PersonGroupPreview from './PersonGroupPreview'
import SourcePreviewComponent from './SourcePreviewComponent'
import EditionPreviewComponent from './EditionPreviewComponent'
import YearPreviewComponent from './YearPreviewComponent'
import PublisherLocPreviewComponent from './PublisherLocPreviewComponent'
import PublisherNamePreviewComponent from './PublisherNamePreviewComponent'

export default class BookCitationPreview extends Component {
  render($$) {
    let node = this.props.node
    
    let el = $$('div').addClass('sc-book-citation-preview')

    el.append(
      $$(SourcePreviewComponent, {node: node}),
      ' (',
      $$(EditionPreviewComponent, {node: node}),
      '). ',
      $$(PersonGroupPreview, {node: node, type: 'editor', label: 'Editors'}),
      ', editors. (',
      $$(YearPreviewComponent, {node: node}),
      ') ',
      $$(PublisherLocPreviewComponent, {node: node}),
      ': ',
      $$(PublisherNamePreviewComponent, {node: node})
    )

    return el
  }
}
