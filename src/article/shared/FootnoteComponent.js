import { NodeComponent } from '../../kit'
import { getLabel } from './nodeHelpers'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class FootnoteComponent extends NodeComponent {
  render ($$) {
    const mode = this.props.mode
    if (mode === PREVIEW_MODE) {
      return this._renderPreviewVersion($$)
    }

    const footnote = this.props.node
    let label = getLabel(footnote) || '?'

    let el = $$('div').addClass('sc-footnote').attr('data-id', footnote.id)
    el.append(
      $$('div').addClass('se-container').append(
        $$('div').addClass('se-label').append(label),
        this._renderValue($$, 'content', { placeholder: this.getLabel('footnote-placeholder') })
      )
    )
    return el
  }

  _renderPreviewVersion ($$) {
    let footnote = this.props.node
    let el = $$('div').addClass('sc-footnote').attr('data-id', footnote.id)

    let label = getLabel(footnote) || '?'
    el.append(
      $$(PreviewComponent, {
        id: footnote.id,
        label: label,
        description: this._renderValue($$, 'content', {
          // TODO: we should need to pass down 'disabled' manually
          // editable=false should be disabled per-se
          disabled: true,
          editable: false
        })
      })
    )
    return el
  }
}
