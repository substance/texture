import Model from './Model'
import throwMethodIsAbstract from '../shared/throwMethodIsAbstract'

export default class Record extends Model {
  getProperties () {
    throwMethodIsAbstract()
  }

  get (name) {
    throwMethodIsAbstract()
  }
}
