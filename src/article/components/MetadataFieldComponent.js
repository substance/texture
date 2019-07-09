import { NodeComponent } from '../../kit'

export default class MetadataFieldComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-metadata-field')
    el.append(
      this._renderValue($$, 'name', { placeholder: this.getLabel('enter-metadata-field-name') }).addClass('se-field-name'),
      this._renderValue($$, 'value', { placeholder: this.getLabel('enter-metadata-field-value') })
    )
    return el
  }
}
