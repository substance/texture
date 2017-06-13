/*
  Returns string-aff nodes directly for convenience
*/
export default function getStringAffs(editorSession) {
  let article = editorSession.getDocument().article
  return article.findAll('string-aff')
}