import renderProperty from './_renderProperty'

export default function renderModel (comp, valueModel, props = {}) {
  console.error('DEPRECATED: use renderProperty() instead')
  return renderProperty(comp, comp.context.editorState.document, valueModel.getPath(), props)
}
