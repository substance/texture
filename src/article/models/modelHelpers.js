export function updateModel(model, props) {
  let session = getModelSession(model)
  let id = model.id
  session.transaction(tx => {
    Object.keys(props).forEach(name => {
      let value = props[name]
      tx.set([id, name], value)
    })
  })
}

// HACK: we do not know which session to use, so we compare it with node.getDocument()
export function setModelValue(model, name, value) {
  let session = getModelSession(model)
  let id = model.id
  session.transaction(tx => {
    tx.set([id, name], value)
  })
}

export function getModelSession(model) {
  let api = model._api
  let node = model._node
  let doc = node.getDocument()
  let session
  if (doc === api.getArticle()) {
    session = api.articleSession
  } else {
    session = api.pubMetaDbSession
  }
  return session
}