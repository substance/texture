export default function addModelObserver (model, fn, comp, options) {
  // NodeModels and alike
  if (model._node) {
    comp.context.appState.addObserver(['document'], fn, comp, {
      stage: options.stage,
      document: {
        path: [model._node.id]
      }
    })
  // PropertyModels
  } else if (model._path) {
    comp.context.appState.addObserver(['document'], fn, comp, {
      path: model._path,
      stage: options.stage
    })
  } else if (model._isCompositeModel) {
    console.error('FIXME: Implement addObserver() for CompositeModel')
  }
}
