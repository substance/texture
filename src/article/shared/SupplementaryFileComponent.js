import { NodeComponent } from '../../kit'
import renderModelComponent from './renderModelComponent'

export default class SupplementaryFileComponent extends NodeComponent {
  render ($$) {
    const model = this.props.model
    const node = model._node
    let el = $$('div').addClass('sc-supplementary-file')
    el.append($$('div').text('TODO: Implement SupplementaryFileComponent'))
    el.append($$('div').text('href:' + node.href))
    el.append($$('div').text('legend:'))
    el.append(
      renderModelComponent(this.context, $$, { model: model.getLegend() }).ref('legend')
    )
    return el
  }
}
