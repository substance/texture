import AbstractEditorSession from './_AbstractEditorSession'

/**
 * Used as an EditorSession in Modals.
 *
 * It has capabilities to 'rebase' onto the latest
 */
export default class StageSession extends AbstractEditorSession {
  constructor (id, parentEditorSession, initialEditorState) {
    super(id, parentEditorSession.getDocument().clone(), initialEditorState)

    this.parentEditorSession = parentEditorSession

    // Once we start using this in a collaborative environment
    // we need to listen to changes applied to the parent session
  }

  dispose () {}
}
