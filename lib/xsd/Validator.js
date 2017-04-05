import DFA from './DFA'

export default
class Validator {

  constructor(data) {
    const tagNames = data.map(e=>e.name)
    this.elementNames = tagNames
    this.elementIds = tagNames.reduce((m,k,idx)=>{m[k]=idx;return m}, {})
    let specs = {}
    let dfas = {}
    // HACK: hard-coded constants for EPSILON and TEXT
    const EPSILON = 0
    data.forEach((e) => {
      specs[e.name] = e
      if (e.dfa) {
        dfas[e.name] = new DFA(e.dfa, EPSILON)
      }
    })
    this.specs = specs
    this.dfas = dfas
    this.errors = []
  }

  isValid(el) {
    let valid = true
    const name = el.tagName
    const spec = this.specs[name]
    const dfa = this.dfas[name]
    if (!spec) throw new Error('Unsupported element')
    // TODO: here we will also check the validity of attributes
    const iterator = el.getChildNodeIterator()
    let state = 0
    while (iterator.hasNext()) {
      const child = iterator.next()
      if (child.isTextNode()) {
        // text nodes are ok if mixed=true
        if (spec.mixed) {
          continue
        }
        // if not, then text nodes must be 'empty'
        if (/^\s*$/.exec(child.textContent)) {
          continue
        }
        this.errors.push(`Text is not allowed in element: <${name}>`)
        continue
      }
      // skip all other nodes
      if (!child.isElementNode()) continue
      const tagName = child.tagName
      const id = this.getId(child.tagName)
      if (id === undefined) {
        this.errors.push(`Unsupported element: <${child.tagName}>`)
        valid = false
        continue
      }
      state = dfa.consume(state, id)
      if (state === -1) {
        this.errors.push(`<${tagName}> is not valid in ${el.tagName}`)
        return false
      }
      valid = this.isValid(child) && valid
    }
    if (!dfa.isFinished(state)) {
      this.errors.push(`<${el.tagName}> is incomplete`)
      return false
    }
    return valid
  }

  getId(name) {
    return this.elementIds[name]
  }

}
