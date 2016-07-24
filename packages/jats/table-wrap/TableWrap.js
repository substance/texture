'use strict';

var Figure = require('../figure/Figure');

function TableWrap() {
  TableWrap.super.apply(this, arguments);
}

Figure.extend(TableWrap);

TableWrap.type = 'table-wrap';

module.exports = TableWrap;