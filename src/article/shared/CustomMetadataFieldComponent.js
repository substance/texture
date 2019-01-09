import { NodeComponent } from '../../kit'

export default class CustomMetadataFieldComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-custom-metadata-field')
    el.append(
      this._renderValue($$, 'name').addClass('se-field-name').ref('name'),
      this._renderValue($$, 'value').ref('value')
    )
    return el
  }
}
