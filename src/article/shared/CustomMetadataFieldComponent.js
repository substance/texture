import { NodeComponent } from '../../kit'
import KeywordInput from '../../kit/ui/KeywordInput'

export default class CustomMetadataFieldComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-custom-metadata-field')
    const node = this._getNode()

    if (this.context.editable) {
      el.append(
        this._renderValue($$, 'name', { placeholder: this.getLabel('enter-custom-field-name') }).addClass('se-field-name'),
        $$(KeywordInput, {
          values: node.values,
          placeholder: this.getLabel('enter-custom-field-value'),
          overlayId: node.id
        }).addClass('se-field-values')
      )
    } else {
      el.append(
        $$('div').addClass('se-field-name').append(node.name),
        $$('div').addClass('se-field-values').append(node.values)
      )
    }
    return el
  }
}
