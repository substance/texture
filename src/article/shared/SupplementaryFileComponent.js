import { NodeComponent } from '../../kit'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import { getLabel } from './nodeHelpers'

export default class SupplementaryFileComponent extends NodeComponent {
  render ($$) {
    const mode = this._getMode()
    // different rendering when rendered as preview or in metadata view
    if (mode === PREVIEW_MODE) {
      return this._renderPreviewVersion($$)
    }

    const node = this.props.node
    const label = getLabel(node) || '?'
    const SectionLabel = this.getComponent('section-label')

    let el = $$('div').addClass(`sc-supplementary-file sm-${mode}`)
    el.append(
      $$('div').addClass('se-header').append(
        // FIXME: not using a dedicated component for the label means that this is not updated
        $$('div').addClass('se-label').text(label),
        // FIXME: not using a dedicated component for the href model means that this is not updated
        $$('div').addClass('se-href').text(node.href)
      ),
      $$(SectionLabel, {label: 'caption-label'}),
      this._renderValue($$, 'legend')
    )
    return el
  }

  _renderPreviewVersion ($$) {
    const node = this.props.node
    // TODO: We could return the PreviewComponent directly.
    // However this yields an error we need to investigate.
    // TODO: we need a read-only version for this
    let thumbnail = this._renderValue($$, 'legend')
    let label = getLabel(node)
    // TODO: PreviewComponent should work with a model
    // FIXME: there is problem with redirected components
    // and Component as props
    return $$('div').append($$(PreviewComponent, {
      id: node.id,
      thumbnail,
      label
    }))
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }
}
