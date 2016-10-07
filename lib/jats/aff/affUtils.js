import toDOM from '../../util/toDOM'

/*
  Get all affiliations for a doc
*/
function getAffs(doc) {
  let affs = doc.getIndex('type').get('aff')
  // Convert to array and get the view for the node
  affs = Object.keys(affs).map(affId => getAdapter(affs[affId]))
  return affs
}

/*
  Turns the xmlContent string into JSON, ready to be
  rendered by the component.
*/
function getAdapter(node) {
  let el = toDOM(node);
  return {
    node: node,
    name: el.textContent
  };
}

export { getAffs, getAdapter }
