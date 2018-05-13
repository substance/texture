import { XMLTextElement } from 'substance'

export default class TableCellElementNode extends XMLTextElement {

  constructor(...args) {
    super(...args)

    this.rowIdx = -1
    this.colIdx = -1
  }

}

TableCellElementNode.type = 'table-cell'