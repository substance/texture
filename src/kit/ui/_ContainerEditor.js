import { ContainerEditor as SubstanceContainerEditor } from 'substance'
import ModifiedSurface from './_ModifiedSurface'

export default class ContainerEditorNew extends ModifiedSurface(SubstanceContainerEditor) {
  // overriding default to allow insertion of 'break' nodes instead of '\n'
  _softBreak () {
    let editorSession = this.getEditorSession()
    let sel = editorSession.getSelection()
    if (sel.isPropertySelection()) {
      // find out if the current node allows for <break>
      let doc = editorSession.getDocument()
      let prop = doc.getProperty(sel.start.path)
      if (prop.targetTypes && prop.targetTypes.has('break')) {
        editorSession.transaction(tx => {
          let br = tx.create({ type: 'break' })
          tx.insertInlineNode(br)
        }, { action: 'soft-break' })
      } else {
        editorSession.transaction(tx => {
          tx.insertText('\n')
        }, { action: 'soft-break' })
      }
    } else {
      editorSession.transaction((tx) => {
        tx.break()
      }, { action: 'break' })
    }
  }
}
