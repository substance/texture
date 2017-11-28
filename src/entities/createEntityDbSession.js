import {
  Configurator,
  EditorSession
} from 'substance'
import EntitiesPackage from './EntitiesPackage'

export default function createEntityDbSession() {
  let configurator = new Configurator()
  configurator.import(EntitiesPackage)
  let entityDb = configurator.createDocument()
  let entityDbSession = new EditorSession(entityDb, {
    configurator
  })
  return entityDbSession
}
