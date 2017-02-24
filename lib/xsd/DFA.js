import isArray from 'substance/util/isArray'
import cloneDeep from 'substance/util/cloneDeep'
import forEach from 'substance/util/forEach'

export const END = 'END'
export const EPSILON = 'EPSILON'

export class DFA {

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
    let dfa = new DFA(cloneDeep(this.transitions))
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
    let dfa = new DFA(transitions)
    dfa.addTransition(0, END, EPSILON)
    return dfa
  }

  /*
    Creates a new DFA representing (...)+ by concatenating this with a kleene version.
  */
  plus() {
    let dfa = new DFA(cloneDeep(this.transitions))
    return dfa.append(this.kleene())
  }

  toJSON() {
    return cloneDeep(this.transitions)
  }

}