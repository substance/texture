import { Configurator } from 'substance'
import TextureEditorSession from '../shared/TextureEditorSession'
import EditorState from '../shared/EditorState'
import EntitiesPackage from './EntitiesPackage'

export default function createEntityDbSession (seed = []) {
  let configurator = new Configurator()
  configurator.import(EntitiesPackage)
  let entityDb = configurator.createDocument()

  // Seed entityDb
  seed.forEach(node => {
    entityDb.create(node)
  })

  let editorState = new EditorState(entityDb)
  let entityDbSession = new TextureEditorSession(editorState, configurator)
  return entityDbSession
}
