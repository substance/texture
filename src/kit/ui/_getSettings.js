export default function getSettings (comp) {
  let appState = comp.context.editorState
  return appState.settings
}
