import { forEach } from 'substance'
import DFA from './DFA'

export default
class Validator {

  constructor(data) {
    const tagNames = data.map(e=>e.name)
    this.elementNames = tagNames
    this.elementIds = tagNames.reduce((m,k,idx)=>{m[k]=idx;return m}, {})
    let dfas = {}
    // HACK: hard-coded constants for EPSILON and TEXT
    const EPSILON = 0
    const TEXT = 1
    data.forEach((e) => {
      if (e.dfa) {
        dfas[e.name] = new DFA(e.dfa, EPSILON)
      }
    })
    this.dfas = dfas
    this.errors = []
  }

  isValid(el) {
    let valid = true
    let dfa = this.dfas[el.tagName]
    if (!dfa) throw new Error('Unsupported element')
    // TODO: here we will also check the validity of attributes
    let iterator = el.getChildNodeIterator()
    let state = 0
    while (iterator.hasNext()) {
      const child = iterator.next()
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
