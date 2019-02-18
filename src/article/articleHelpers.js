import { documentHelpers, selectionHelpers, last } from 'substance'
import FigurePanel from './models/FigurePanel'

export function importFigures (tx, sel, files, paths) {
  if (files.length === 0) return

  let containerPath = sel.containerPath
  let figures = files.map((file, idx) => {
    let href = paths[idx]
    let mimeType = file.type
    let panelTemplate = FigurePanel.getTemplate()
    panelTemplate.content.href = href
    panelTemplate.content.mimeType = mimeType
    let figure = documentHelpers.createNodeFromJson(tx, {
      type: 'figure',
      panels: [ panelTemplate ]
    })
    // Note: this is necessary because tx.insertBlockNode()
    // selects the inserted node
    // TODO: maybe we should change the behavior of tx.insertBlockNode()
    // so that it is easier to insert multiple nodes in a row
    if (idx !== 0) {
      tx.break()
    }
    tx.insertBlockNode(figure)
    return figure
  })
  selectionHelpers.selectNode(tx, last(figures).id, containerPath)
}
