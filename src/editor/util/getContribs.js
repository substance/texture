export default function getContribs(editorSession) {
  let article = editorSession.getDocument().article
  return article.findAll('contrib')
}