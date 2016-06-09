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
  Content
  (label?, title*, (ack | app-group | bio | fn-group | glossary | ref-list | notes | sec)*)
*/

RefList.static.defineSchema({
  label: { type: 'string', optional: true },
  xmlAttributes: { type: 'object', default: {} },
  // inherits 'nodes' from Container
  refLists: { type: ['id'], default: [] }
});

module.exports = RefList;
