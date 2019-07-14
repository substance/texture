import { EditorSession } from 'substance'

export default class ArticleEditorSession extends EditorSession {
  copy () {
    return this.context.api._customCopy() || super.copy()
  }
  cut () {
    return this.context.api._customCut() || super.cut()
  }
  paste (content, options) {
    return this.context.api._customPaste(content, options) || super.paste(content, options)
  }
  insertText (text) {
    return this.context.api._customInsertText(text) || super.insertText(text)
  }
}
