'use strict';

import Figure from '../figure/Figure'

function TableWrap() {
  TableWrap.super.apply(this, arguments);
}

Figure.extend(TableWrap);

TableWrap.type = 'table-wrap';

export default TableWrap;