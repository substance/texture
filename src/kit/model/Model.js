import throwMethodIsAbstract from '../shared/throwMethodIsAbstract'

export default class Model {
  get id () {
    throwMethodIsAbstract()
  }

  get type () {
    throwMethodIsAbstract()
  }
}
