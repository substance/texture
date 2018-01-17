import createEntityDbSession from './entities/createEntityDbSession'

export default {
  load(/*jsonStr*/) {
    return createEntityDbSession()
  }
}
