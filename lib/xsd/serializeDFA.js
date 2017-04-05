import { forEach } from 'substance'

export default function serializeDFA(xsd, dfas) {
  let nameMap = {}
  let tagNames = ['EPSILON', 'TEXT'].concat(Object.keys(xsd.elements))
  tagNames.forEach((name, idx) => {
    nameMap[name] = idx
  })
  let elements = {}
  forEach(dfas, (dfa, name) => {
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
  return { tagNames, elements }
}
