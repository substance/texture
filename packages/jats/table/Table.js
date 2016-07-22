'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.

var BlockNode = require('substance/model/BlockNode');

function Table() {
  Table.super.apply(this, arguments);
}

BlockNode.extend(Table);

Table.type = 'table';

Table.defineSchema({
  attributes: { type: 'object', default: {} },
  htmlContent: {type: 'string'}
});

module.exports = Table;