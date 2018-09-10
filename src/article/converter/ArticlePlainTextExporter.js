import { getLabel } from '../shared/nodeHelpers'

export default class ArticlePlainTextExporter {
  export (article) {
    console.error('TODO: implement full article to plain-text conversion')
  }

  exportNode (node) {
    if (node.isContainer()) {
      return this._exportContainer(node)
    } else if (node.isText()) {
      return this._exportText(node.getDocument(), node.getPath())
    } else {
      switch (node.type) {
        case 'figure':
          return this._exportFigure(node)
        case 'table':
          return this._exportTable(node)
        case 'table-figure':
          return this._exportTableFigure(node)
        default:
          //
      }
    }

    if (node._isXMLNode) {
      return node.toXML().textContent || ''
    } else {
      console.error('TODO: implement node -> plain-text conversion for node type', node.type)
      return ''
    }
  }

  _exportContainer (node) {
    if (!node) return ''
    return node.getNodes().map(node => {
      return this.exportNode(node)
    }).join('\n\n')
  }

  _exportText (doc, path) {
    return doc.get(path) || ''
  }

  _exportTable (node) {
    if (!node) return ''
    return node.getCellMatrix().map(row => {
      return row.map(cell => {
        if (cell.isShadowed()) {
          return ''
        } else {
          return cell.getText()
        }
      }).join('\t')
    }).join('\n')
  }

  _exportFigure (node) {
    if (!node) return ''
    let doc = node.getDocument()
    let result = []
    result.push(getLabel(node) + ': ' + this._exportText(doc, [node.id, 'title']))
    result.push(this._exportContainer(node.getCaption()))
    return result.join('\n')
  }

  _exportTableFigure (node) {
    if (!node) return ''
    let doc = node.getDocument()
    let result = []
    result.push(getLabel(node) + ': ' + this._exportText(doc, [node.id, 'title']))
    result.push(this._exportTable(node.getContent()))
    result.push(this._exportContainer(node.getCaption()))
    return result.join('\n')
  }
}
