// TODO: We should only have nodes or values as models
export default function addModelObserver (model, fn, comp, options = {}) {
  let stage = options.stage || 'render'
  // NodeModels and alike
  if (model._isNode) {
    // NOTE: here we exploit internal knowledge about node types and only register
    // for updates that are relevant on this level
    // E.g., for an XMLElementNode we are only interested in changes to `<id>._childNodes`
    // TODO: allow to register for multiple paths, e.g. `childNodes` and `attributes`
    let node = model
    let selector
    if (node._elementType === 'element') {
      selector = {
        path: [node.id, '_childNodes']
      }
    } else {
      selector = {
        path: [node.id]
      }
    }
    comp.context.appState.addObserver(['document'], fn, comp, {
      stage,
      document: selector
    })
  // PropertyModels
  } else if (model._isValue) {
    let path = model.getPath()
    comp.context.appState.addObserver(['document'], fn, comp, {
      stage,
      document: { path }
    })
  }
}
