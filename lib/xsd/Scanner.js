import forEach from 'substance/util/forEach'

export default class Scanner {
  constructor(elements, dfas) {
    this.elements = elements
    this.dfas = dfas
  }

  serialize() {
    let nameMap = {}
    let tagNames = Object.keys(this.elements)
    tagNames.push('EPSILON')
    tagNames.forEach((name, idx) => {
      nameMap[name] = idx
    })
    let elements = {}
    let serialized = {
      tagNames, elements
    }
    forEach(this.dfas, (dfa, name) => {
      let _dfa = {}
      let transitions = dfa.transitions
      forEach(transitions, (t, from) => {
        let _t = {}
        forEach(t, (tokens, to) => {
          _t[to] = tokens.map((name) => {
            return nameMap[name]
          })
        })
        _dfa[from] = _t
      })
      elements[name] = _dfa
    })
    return serialized
  }
}