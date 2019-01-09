import createValueModel from '../model/createValueModel'
import renderModel from './_renderModel'

export default function renderValue ($$, comp, doc, path, options = {}) {
  let prop = doc.getProperty(path)
  let valueModel = createValueModel(comp.context.editorSession, path, prop)
  return renderModel($$, comp, valueModel, options)
}
