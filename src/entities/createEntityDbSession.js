import {
  Configurator,
  EditorSession
} from 'substance'
import EntitiesPackage from './EntitiesPackage'
import entityDbSeed from '../../data/entityDbSeed'

export default function createEntityDbSession() {
  let configurator = new Configurator()
  configurator.import(EntitiesPackage)
  let entityDb = configurator.createDocument()

  // Seed entityDb
  entityDbSeed.forEach(node => {
    entityDb.create(node)
  })

  let entityDbSession = new EditorSession(entityDb, {
    configurator
  })
  return entityDbSession
}
