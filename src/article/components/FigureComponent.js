import { $$ } from 'substance'
import { NodeComponent } from '../../kit'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import LabelComponent from './LabelComponent'
import { getLabel } from '../shared/nodeHelpers'

export default class FigureComponent extends NodeComponent {
  render () {
    const mode = this._getMode()
    // different rendering when rendered as preview or in metadata view
    if (mode === PREVIEW_MODE) {
      return this._renderPreviewVersion()
    } else {
      return this._renderManuscriptVersion()
    }
  }

  _getClassNames () {
    return `sc-figure`
  }

  _renderManuscriptVersion () {
    const mode = this._getMode()
    const node = this.props.node
    const SectionLabel = this.getComponent('section-label')

    let el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', node.id)
      .addClass(`sm-${mode}`)

    el.append(
      $$(SectionLabel, { label: 'label-label' }),
      $$(LabelComponent, { node }),
      // no label for the graphic
      this._renderContent(),
      $$(SectionLabel, { label: 'title-label' }),
      this._renderValue('title', { placeholder: this.getLabel('title-placeholder') }).addClass('se-title'),
      $$(SectionLabel, { label: 'legend-label' }),
      this._renderValue('legend', { placeholder: this.getLabel('legend-placeholder') }).addClass('se-legend')
    )

    return el
  }

  _renderContent () {
    return this._renderValue('content').addClass('se-content')
  }

  _renderPreviewVersion () {
    const node = this.props.node
    // TODO: We could return the PreviewComponent directly.
    // However this yields an error we need to investigate.
    let thumbnail
    let content = node.resolve('content')
    if (content.type === 'graphic') {
      let ContentComponent = this.getComponent(content.type)
      thumbnail = $$(ContentComponent, {
        node: content
      })
    }
    // TODO: PreviewComponent should work with a model
    return $$('div').append($$(PreviewComponent, {
      id: node.id,
      thumbnail,
      label: getLabel(node)
    })).addClass('sc-figure-panel').attr('data-id', node.id)
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }
}
