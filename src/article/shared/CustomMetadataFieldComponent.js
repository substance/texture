import { createValueModel, NodeComponent } from '../../kit'
import KeywordInput from './KeywordInput'

export default class CustomMetadataFieldComponent extends NodeComponent {
  getActionHandlers () {
    return {
      addValue: this._addValue
    }
  }

  render ($$) {
    let el = $$('div').addClass('sc-custom-metadata-field')
    const node = this._getNode()
    const valuesModel = this._getValuesModel()

    if (this.context.editable) {
      el.append(
        this._renderValue($$, 'name', { placeholder: this.getLabel('enter-custom-field-name') }).addClass('se-field-name'),
        $$(KeywordInput, {
          model: valuesModel,
          placeholder: this.getLabel('enter-keywords'),
          label: this.getLabel('edit-keywords'),
          overlayId: valuesModel.id
        }).addClass('se-field-values')
      )
    } else {
      el.append(
        $$('div').addClass('se-field-name').append(node.name),
        $$('div').addClass('se-field-values').append(valuesModel.getValue())
      )
    }
    return el
  }

  _addValue (value) {
    const node = this._getNode()
    this.context.api._appendChild([node.id, 'values'], { type: 'custom-metadata-value', content: value })
  }

  _getValuesModel () {
    const node = this._getNode()
    return createValueModel(this.context.api, [node.id, 'values'])
  }
}
