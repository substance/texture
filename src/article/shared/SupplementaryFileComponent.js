import { NodeComponent } from '../../kit'
import renderModelComponent from './renderModelComponent'

export default class SupplementaryFileComponent extends NodeComponent {
  render ($$) {
    const model = this.props.model
    const node = model._node
    const SectionLabel = this.getComponent('section-label')
    let el = $$('div').addClass('sc-supplementary-file').append(
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

    return el
  }
}
