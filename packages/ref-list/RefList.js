'use strict';

var Container = require('substance/model/Container');

/*
  ref-list

  List of bibliographic references for a document or document component.
*/
function RefList() {
  RefList.super.apply(this, arguments);
}

Container.extend(RefList);

RefList.static.name = 'ref-list';

  /*
    (
      label?,
      title?,
      (
        address | alternatives | array | boxed-text | chem-struct-wrap | code | fig |
        fig-group | graphic | media | preformat | supplementary-material | table-wrap |
        table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math |
        mml:math | p | related-article | related-object | ack | disp-quote | speech | statement |
        verse-group | x | ref
      )*,
      (ref-list)*
    )
  */
RefList.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  label: { type: 'string', optional: true },
  title: { type: 'string', optional: true },
  // inherits 'nodes' from Container
  refLists: { type: ['id'], default: [] }
});

module.exports = RefList;
