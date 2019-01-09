import { ValueComponent } from '../../kit'

export default class FigureMetadataComponent extends ValueComponent {
  render ($$) {
    let items = this.props.model.getItems()
    let el = $$('div').addClass('sc-figure-metadata')
    el.append(
      items.map(field => this._renderMetadataField($$, field))
    )
    return el
  }

  _renderMetadataField ($$, metadataField) {
    let MetdataFieldComponent = this.getComponent(metadataField.type)
    return $$(MetdataFieldComponent, { node: metadataField }).ref(metadataField.id)
  }
}
