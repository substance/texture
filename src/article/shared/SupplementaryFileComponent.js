import { NodeComponent } from '../../kit'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import renderModelComponent from './renderModelComponent'

export default class SupplementaryFileComponent extends NodeComponent {
  render ($$) {
    const model = this.props.model
    const node = model._node
    const label = model.getLabel() || '?'
    const mode = this.props.mode || 'manuscript'
    const SectionLabel = this.getComponent('section-label')
    const Container = this.getComponent('container')

    let el = $$('div').addClass(`sc-supplementary-file sm-${mode}`)

    if (mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: model.id,
          label: label,
          description: $$(Container, {
            node: model.getLegend(),
            disabled: true,
            editable: false
          })
        })
      )
    } else {
      el.append(
        $$('div').addClass('se-header').append(
          $$('div').addClass('se-label').text(node.label),
          $$('div').addClass('se-href').text(node.href)
        ),
        $$(SectionLabel, {label: 'caption-label'}),
        renderModelComponent(this.context, $$, {
          label: this.getLabel('caption'),
          model: model.getLegend()
        }).ref('legend')
      )
    }

    return el
  }
}
