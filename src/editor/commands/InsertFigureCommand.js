import { InsertNodeCommand as SubstanceInsertNodeCommand } from 'substance'
import InsertFigure from './InsertFigure'

export default class InsertNodeCommand extends SubstanceInsertNodeCommand {

  execute(params, context) {
    let state = params.commandState
    if (state.disabled) return
    let editorSession = this._getEditorSession(params, context)
    editorSession.transaction((tx) => {
      let node = this.createNodes(tx, params, context)
      this.setSelection(tx, node)
    })
  }

  createNodes(tx, params) {
    let lastNode = {}
    params.files.forEach((file) => {
      let node = InsertFigure(tx, file)
      lastNode = tx.insertBlockNode(node)
    })
    return lastNode
  }

  insertFigure(tx, file) {
    let imageUrl = URL.createObjectURL(file)
    let fig = tx.createElement('fig')
    fig.append(
     tx.createElement('object-id').text(fig.id),
     tx.createElement('title').text('Figure title'),
     tx.createElement('caption').append(
       tx.createElement('p').text('Figure caption')
     ),
     tx.createElement('graphic').attr({
       'mime-subtype': 'jpeg',
       'mimetype': 'image',
       'xlink:href': imageUrl
     })
    )
    return fig
  }
}
