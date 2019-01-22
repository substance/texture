import { NodeComponent } from '../../kit'

export default class CustomMetadataFieldComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-custom-metadata-field')
    el.append(
      this._renderValue($$, 'name', { placeholder: this.getLabel('enter-custom-field-name') }).addClass('se-field-name'),
      this._renderValue($$, 'value', { placeholder: this.getLabel('enter-custom-field-value') })
    )
    return el
  }
}
