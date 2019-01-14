import _getSettings from './_getSettings'

export default function renderModel ($$, comp, valueModel, options = {}) {
  let ValueComponent = comp.getComponent(valueModel.type)

  let valueSettings
  let settings = _getSettings(comp)
  if (settings) {
    valueSettings = settings.getSettingsForValue(valueModel.getPath())
  }
  let props = Object.assign({
    disabled: comp.props.disabled,
    // TODO: rename 'model' to 'value' (then we have it is clear when node and when values are used)
    model: valueModel
  }, valueSettings, options)
  return $$(ValueComponent, props)
}
