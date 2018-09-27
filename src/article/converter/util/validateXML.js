export default function validateXML (xmlSchema, dom, options = {}) {
  let root = dom.find(xmlSchema.getStartElement())
  let allowNotImplemented = true
  if (options.hasOwnProperty('allowNotImplemented')) {
    allowNotImplemented = Boolean(options.allowNotImplemented)
  }
  if (!root) {
    return {
      errors: [{
        msg: 'Start element is missing.',
        el: dom
      }]
    }
  } else {
    return validateElement(xmlSchema, root, { allowNotImplemented })
  }
}

function validateElement (xmlSchema, el, options) {
  const allowNotImplemented = options.allowNotImplemented
  let errors = []
  let valid = true
  let q = [el]
  while (q.length > 0) {
    let next = q.shift()
    let elementSchema = xmlSchema.getElementSchema(next.tagName)
    if (!elementSchema) continue
    if (!allowNotImplemented && elementSchema.type === 'not-implemented') {
      errors.push({
        msg: `<${next.tagName}> is not implemented yet.`,
        el: next.parentNode
      })
      valid = false
    }
    let res = xmlSchema.validateElement(next)
    if (!res.ok) {
      errors = errors.concat(res.errors)
      valid = false
    }
    if (next.isElementNode()) {
      q = q.concat(next.getChildren())
    }
  }
  return {
    errors: errors,
    ok: valid
  }
}
