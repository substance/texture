import { forEach } from 'substance'

export default
class DFA {

  constructor(data, EPSILON) {
    this.EPSILON = EPSILON
    let T = []
    forEach(data, (transitions, state) => {
      const t = {}
      forEach(transitions, (ids, nextState) => {
        ids.forEach(id=>{
          t[id]=nextState
        })
      })
      T[state] = t
    })
    this.T = T
  }

  consume(state, id) {
    const T = this.T
    let nextState = T[state][id]
    if (nextState !== undefined) {
      return nextState
    }
    const EPSILON = this.EPSILON
    while(T[state][EPSILON] !== undefined) {
      state = T[state][EPSILON]
      nextState = T[state][id]
      if (nextState !== undefined) {
        return nextState
      }
    }
    return -1
  }

  isFinished(state) {
    const T = this.T
    const EPSILON = this.EPSILON
    if (state === 'END') return true
    while(T[state][EPSILON] !== undefined) {
      state = T[state][EPSILON]
      if (state === 'END') return true
    }
    return false
  }

}