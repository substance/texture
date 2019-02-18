// This is only used for Value models
export default function addModelObserver (model, fn, comp, options = {}) {
  let stage = options.stage || 'render'
  if (model._isValue) {
    let path = model.getPath()
    comp.context.appState.addObserver(['document'], fn, comp, {
      stage,
      document: { path }
    })
  }
}
