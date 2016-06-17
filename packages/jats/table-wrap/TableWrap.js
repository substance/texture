'use strict';

var Figure = require('../figure/Figure');

function TableWrap() {
  TableWrap.super.apply(this, arguments);
}

Figure.extend(TableWrap);

TableWrap.static.name = 'table-wrap';

module.exports = TableWrap;