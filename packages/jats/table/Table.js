'use strict';

import { BlockNode } from 'substance'

function Table() {
  Table.super.apply(this, arguments);
}

BlockNode.extend(Table);

Table.type = 'table';
Table.define({
  attributes: { type: 'object', default: {} },
  htmlContent: {type: 'string'}
});

export default Table;