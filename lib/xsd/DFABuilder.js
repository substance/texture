/* eslint-disable no-console, no-debugger */

import { forEach, isArray, cloneDeep } from 'substance'
import { parseXSD, ELEMENT, CHOICE, SEQUENCE, GROUP, REFERENCE } from './parseXSD'

export const END = 'END'
export const EPSILON = 'EPSILON'

/*
  This is used to construct a DFA specification
  during parsing of a XSD file.

  The result is serialized and used to construct a DFA later.
*/
export default class DFABuilder {

  constructor(transitions) {
    this.transitions = transitions || {}
  }

  addTransition(from, to, tokens) {
    if (!isArray(tokens)) tokens = [tokens]
    from = parseInt(from, 10)
    let _from = this.transitions[from]
    if (!_from) {
      this.transitions[from] = _from = {}
    }
    if (!_from[to]) {
      _from[to] = tokens
    } else {
      _from[to] = _from[to].concat(tokens)
    }
    return this
  }

  /*
    Creates a new DFA with all state values shifted by a given offset.
    Used when appending this DFA to another one (-> sequence)
  */
  append(other) {
    // all other state ids must have higher number then this one
    let offset = Object.keys(this.transitions).reduce((max, val)=>Math.max(max, val), -1)+1
    // Now we must replace the transitions to 'end' to the start of the other
    forEach(this.transitions, (t) => {
      let endTransition = t[END]
      if (endTransition) {
        delete t[END]
        t[offset] = endTransition
      }
    })
    forEach(other.transitions, (t, from) => {
      from = parseInt(from, 10)
      let _from = this.transitions[from+offset] = {}
      forEach(t, (tokens, to) => {
        if (to !== END) {
          to = parseInt(to, 10)
          _from[to+offset] = tokens.slice()
        } else {
          _from[END] = tokens.slice()
        }
      })
    })
    return this
  }

  // used for merging choices
  merge(other) {
    // all other state ids must have higher number then this one
    let offset = Object.keys(this.transitions).reduce((max, val)=>Math.max(max, val), -1)+1
    forEach(other.transitions, (t, from) => {
      from = parseInt(from, 10)
      if (from === 0) {
        forEach(t, (tokens, to) => {
          if (to !== END) {
            to = parseInt(to, 10)+offset
          }
          this.addTransition(0, to, tokens.slice())
        })
      } else {
        let _from = this.transitions[from+offset] = {}
        forEach(t, (tokens, to) => {
          if (to !== END) {
            to = parseInt(to, 10)+offset
          }
          _from[to] = tokens.slice()
        })
      }
    })
    return this
  }

  /*
    Creates a new DFA with same transitions plus an EPSILON transition from start to END
  */
  optional() {
    let dfa = new DFABuilder(cloneDeep(this.transitions))
    dfa.addTransition(0, END, EPSILON)
    return dfa
  }

  /*
    Creates a new DFA representing (...)* which is derived by replacing all transitions to END with transitions to START
    and adding an EPSILON transition from START to END
  */
  kleene() {
    let transitions = cloneDeep(this.transitions)
    forEach(transitions, (t) => {
      let endTransition = t[END]
      if (endTransition) {
        delete t[END]
        t[0] = endTransition
      }
    })
    let dfa = new DFABuilder(transitions)
    dfa.addTransition(0, END, EPSILON)
    return dfa
  }

  /*
    Creates a new DFA representing (...)+ by concatenating this with a kleene version.
  */
  plus() {
    let dfa = new DFABuilder(cloneDeep(this.transitions))
    return dfa.append(this.kleene())
  }

  toJSON() {
    return cloneDeep(this.transitions)
  }

}

/*
  A DFA (deterministic finite automata) represented as a graph where
  each node is a state and edges are transitions consuming tokens.

  Patterns:

  - Sequence:
    ```
      Expression: A B

      Graph:  0 -(A)-> 1 -(B)-> END
    ```
  - Simple Choice (without nested structure):
    ```
      Expression: (A | B)

      Graph:  0 -(A,B)-> END
    ```
  - Modifier `?` (ε: empty string)
    ```
      Expression: (A)?

      Graph:  0 -(A, ε)-> END
    ```

  - Modifier `*` (repetition using a reflexive edge)
    ```
      Expression: (A)* (reflexiv edge)
             /-(A)-\
             |     |
              \   /
               v /
      Graph:    0  --(ε)-->  END
    ```
  - Modifier `+` (like `*` plus extra transition at the beginning)
    ```
      Expression: (A)+ (sequence and reflexive edge)
                       /-(A)-\
                       |     |
                        \   /
                         v /
      Graph:  0 --(A)-->  1  --(ε)-> END
    ```
*/

DFABuilder.compile = function(xsdStr, options={}) {
  const xsd = parseXSD(xsdStr)
  const dfas = {}
  forEach(xsd.elements, (element) => {
    // the DFA will be stored in element._dfa
    let dfa = _processElement(xsd, element)
    dfas[element.name] = dfa
  })
  return {xsd, dfas}
}

function _processElement(context, element) {
  // some elements do only have attributes
  if (element._dfa) return element._dfa
  const content = element.content
  let dfa
  if (!content) {
    // TODO: do we want an empty DFA?
    dfa = new DFABuilder()
  } else {
    switch (content.type) {
      // for instance <body> just references the 'body-model' group
      case REFERENCE: {
        dfa = _transformReference(context, content)
        break
      }
      case CHOICE: {
        dfa = _transformChoice(context, content)
        break
      }
      case SEQUENCE: {
        dfa = _transformSequence(context, content)
        break
      }
      default:
        console.warn('Element content type not yet supported', content)
        debugger
    }
  }
  element._dfa = dfa
  return dfa
}

// a reference is pointing to a group or to an element
function _transformReference(context, ref) {
  let cardinality = ref.cardinality
  let dfa
  if (ref.targetType === ELEMENT) {
    dfa = _transformElement(context, ref.targetName, cardinality)
  } else {
    console.assert(ref.targetType === GROUP, 'ref should point to a group')
    let name = ref.targetName
    let group = context.groups[name]
    if (!group) throw new Error('Unknown group: '+name)
    // TODO: we need to apply cardinality transformations here
    if (group._dfa) {
      return _addCardinality(group._dfa, cardinality)
    }
    let content = group.content
    switch(content.type) {
      case SEQUENCE: {
        dfa = _transformSequence(context, content)
        break
      }
      case CHOICE: {
        dfa = _transformChoice(context, content)
        break
      }
      default:
        console.warn('Group content not supported yet', content)
        debugger
    }
    group._dfa = dfa
    dfa = _addCardinality(dfa, cardinality)
  }
  return dfa
}

// a sequence adds a state after each child
function _transformSequence(context, seq) {
  let children = seq.children
  let dfa = new DFABuilder()
  let L = children.length
  for (let i = 0; i < L; i++) {
    let child = children[i]
    switch(child.type) {
      case ELEMENT: {
        dfa.append(_transformElement(context, child.name, child.cardinality))
        break
      }
      case REFERENCE: {
        dfa.append(_transformReference(context, child))
        break
      }
      case CHOICE: {
        dfa.append(_transformChoice(context, child))
        break
      }
      case SEQUENCE: {
        dfa.append(_transformSequence(context, child))
        break
      }
      default:
        debugger
    }
  }
  dfa = _addCardinality(dfa, seq.cardinality)
  return dfa
}

function _transformChoice(context, choice) {
  let children = choice.children
  let dfa = new DFABuilder()
  let L = children.length
  for (let i = 0; i < L; i++) {
    let child = children[i]
    switch(child.type) {
      case ELEMENT: {
        dfa.merge(_transformElement(context, child.name, child.cardinality))
        break
      }
      case REFERENCE: {
        dfa.merge(_transformReference(context, child))
        break
      }
      case CHOICE: {
        dfa.merge(_transformChoice(context, child))
        break
      }
      case SEQUENCE: {
        dfa.merge(_transformSequence(context, child))
        break
      }
      default:
        debugger
    }
  }
  dfa = _addCardinality(dfa, choice.cardinality)
  return dfa
}

function _transformElement(context, name, cardinality) {
  let dfa = new DFABuilder()
  dfa.addTransition(0, END, name)
  return _addCardinality(dfa, cardinality)
}

function _addCardinality(dfa, cardinality) {
  switch(cardinality) {
    case 1:
      return dfa
    case '?':
      return dfa.optional()
    case '*':
      return dfa.kleene()
    case '+':
      return dfa.plus()
    default:
      throw new Error('Invalid state.')
  }
}
