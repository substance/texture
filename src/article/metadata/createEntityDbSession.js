import TextureConfigurator from '../../TextureConfigurator'
import { TextureEditorSession, EditorState } from '../../shared'
import EntitiesPackage from './EntitiesPackage'

export default function createEntityDbSession (seed = []) {
  let configurator = new TextureConfigurator()
  configurator.import(EntitiesPackage, { standalone: true })
  let entityDb = configurator.createDocument()

  // Seed entityDb
  seed.forEach(node => {
    entityDb.create(node)
  })

  let editorState = new EditorState(entityDb)
  let entityDbSession = new TextureEditorSession(editorState, configurator)
  return entityDbSession
}
