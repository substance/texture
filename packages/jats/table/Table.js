import { BlockNode } from 'substance'

class Table extends BlockNode {}

Table.type = 'table'

Table.define({
  attributes: { type: 'object', default: {} },
  htmlContent: {type: 'string'}
})

export default Table
