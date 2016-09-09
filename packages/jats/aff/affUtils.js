'use strict';

var toDOM = require('../../../util/toDOM');

/*
  Get all affiliations for a doc
*/
function getAffs(doc) {
  var affs = doc.getIndex('type').get('aff');
  // Convert to array and get the view for the node
  affs = Object.keys(affs).map(affId => getAdapter(affs[affId]));
  return affs;
}

/*
  Turns the xmlContent string into JSON, ready to be
  rendered by the component.
*/
function getAdapter(node) {
  var el = toDOM(node);
  return {
    node: node,
    name: el.textContent
  };
}

module.exports = {
  getAffs: getAffs,
  getAdapter: getAdapter
};