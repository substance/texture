/*
  The scanner is a DFA (deterministic finite automata) represented as a graph where
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

/* eslint-disable no-console, no-debugger */

import forEach from 'substance/util/forEach'
import { ELEMENT, CHOICE, SEQUENCE, GROUP, REFERENCE } from './parseXSD'
import { DFA, END } from './DFA'
import Scanner from './Scanner'

export default function createScanner({elements, groups}) {
  // ATTENTION: this is WIP
  // processing selectively to understand how to generalize
  console.log('creating scanner', elements, groups)
  const context = { elements, groups }
  const dfas = {}
  forEach(elements, (element) => {
    // the DFA will be stored in element._dfa
    let dfa = _processElement(context, element)
    dfas[element.name] = dfa
  })
  return new Scanner(elements, dfas)
}

function _processElement(context, element) {
  // some elements do only have attributes
  if (element._dfa) return element._dfa
  const content = element.content
  let dfa
  if (!content) {
    // TODO: do we want an empty DFA?
    dfa = new DFA()
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
  let dfa = new DFA()
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
  let dfa = new DFA()
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
  let dfa = new DFA()
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
