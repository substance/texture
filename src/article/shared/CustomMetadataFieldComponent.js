import { createValueModel, KeywordInput, NodeComponent } from '../../kit'

export default class CustomMetadataFieldComponent extends NodeComponent {
  getActionHandlers () {
    return {
      updateValues: this._updateValues
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
          placeholder: this.getLabel('enter-keyword'),
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

  _updateValues (values) {
    const model = this._getValuesModel()
    model.setValue(values)
  }

  _getValuesModel () {
    const node = this._getNode()
    return createValueModel(this.context.api, [node.id, 'values'])
  }
}
