import InsertNodeCommand from './InsertNodeCommand'

export default class InsertFigureCommand extends InsertNodeCommand {

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
      let node = this.insertImage(tx, file)
      lastNode = tx.insertBlockNode(node)
    })
    return lastNode
  }

  /*
    Inserts file and image nodes
  */
  insertImage(tx, file) {
    let imageUrl = URL.createObjectURL(file)
    let fig = tx.createElement('fig')
    fig.append(
     tx.createElement('object-id').text(fig.id),
     tx.createElement('title').text(''),
     tx.createElement('caption').append(
       tx.createElement('p').text('')
     ),
     tx.createElement('graphic').attr({
       'mime-subtype': 'jpeg',
       'mimetype': 'image',
       'xlink:href': imageUrl
     })
    )
    return fig
  }
  // execute(params) {
  //   let editorSession = params.editorSession
  //
  //   editorSession.transaction((tx) => {
  //     params.files.forEach((file) => {
  //       this.insertImage(tx, file)
  //     })
  //   })
  // }
  //
  // insertImage(tx, file) {
  //   // Create file node for the image
  //   // let imageFile = tx.create({
  //   //   type: 'file',
  //   //   fileType: 'image',
  //   //   mimeType: file.type,
  //   //   sourceFile: file
  //   // })
  //
  //   let fig = tx.createElement('fig')
  //   fig.append(
  //     tx.createElement('object-id').attr('pub-id-type', 'doi').text('test'),
  //     tx.createElement('title').text(''),
  //     tx.createElement('caption').append(
  //       tx.createElement('p').text('')
  //     ),
  //     tx.createElement('graphic').attr({
  //       'mime-subtype': 'jpeg',
  //       'mimetype': 'image',
  //       'xlink:href': './assets/fig1.jpg'
  //     })
  //   )
  //   return fig
  // }
}
