import { Component } from 'substance'
import PersonGroupPreview from './PersonGroupPreview'
import YearPreviewComponent from './YearPreviewComponent'
import ArticleTitlePreviewComponent from './ArticleTitlePreviewComponent'
import SourcePreviewComponent from './SourcePreviewComponent'
import VolumePreviewComponent from './VolumePreviewComponent'
import FpagePreviewComponent from './FpagePreviewComponent'
import LpagePreviewComponent from './LpagePreviewComponent'

export default class JournalCitationPreview extends Component {
  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-journal-citation-preview')

    el.append(
      $$(PersonGroupPreview, {node: node, type: 'author', label: 'Authors'}),
      '. ',
      // We disable the editors display for now as it is most often empty and
      // produces ugly looking previews
      // $$(PersonGroupPreview, {node: node, type: 'editor', label: 'Editors'}),
      // '. ',
      $$(YearPreviewComponent, {node: node}),
      '. ',
      $$(ArticleTitlePreviewComponent, {node: node}),
      '. ',
      $$(SourcePreviewComponent, {node: node}),
      ' ',
      $$('strong').append(
        $$(VolumePreviewComponent, {node: node})
      ),
      ':',
      $$(FpagePreviewComponent, {node: node}),
      '-',
      $$(LpagePreviewComponent, {node: node}),
      '.'
    )

    return el
  }
}
