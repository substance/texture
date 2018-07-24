export function updateModel(model, props) {
  let session = getDocumentSessionForModel(model)
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
  let session = getDocumentSessionForModel(model)
  let id = model.id
  session.transaction(tx => {
    tx.set([id, name], value)
  })
}

export function getDocumentSessionForModel(model) {
  let api = model._api
  let session = api.getArticleSession()
  return session
}