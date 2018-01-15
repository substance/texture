import {
  Configurator,
  EditorSession
} from 'substance'
import EntitiesPackage from './EntitiesPackage'

export default function createEntityDbSession(seed = []) {
  let configurator = new Configurator()
  configurator.import(EntitiesPackage)
  let entityDb = configurator.createDocument()

  // Seed entityDb
  seed.forEach(node => {
    entityDb.create(node)
  })

  let entityDbSession = new EditorSession(entityDb, {
    configurator
  })
  return entityDbSession
}
