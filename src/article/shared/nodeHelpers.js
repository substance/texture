/**
 * Gets the label for the specified node.
 *
 * Labels are used at various points in the UI to prefix elements when they are displayed to the user. The are mostly
 * used by list elements to determine the delimter to use.
 *
 * @export
 * @param {*} node - The target node.
 * @returns {string|undefined} The target node's label.
 */
export function getLabel (node)
{
  if (node._isModel)
  {
    node = node._node;
  }

  let label = node.label
  if (node && node.state)
  {
    label = node.state.label || label;
  }
  return label;
}

/**
 * Returns the specified nodes position, relative to it's siblings.
 *
 * Can be used to determine a nodes position in a list.
 *
 * @export
 * @param {*} node - The target node.
 * @returns {number} the target nodes position.
 */
export function getPos (node)
{
  let pos;
  if (node && node.state)
  {
    pos = node.state.pos;
  }

  // If the node has no position, default to a high number.
  if (pos === undefined)
  {
    pos = Number.MAX_VALUE;
  }
  return pos;
}

/**
 * Recursively find the nearest parent by type.
 *
 * @export
 * @param   {*}       node   the node to start the search from.
 * @param   {string}  type   the of node to find.
 * @returns {node|undefined} the requested node, if found.
 */
export function findParentByType (node, type)
{
  let parent = node.getParent();
  while (parent)
  {
    if (parent.isInstanceOf(type))
    {
      return parent;
    }
    parent = parent.getParent();
  }
}

export function ifNodeOrRelatedHasChanged (node, change, cb) {
  let doc = node.getDocument()
  let id = node.id
  let hasChanged = change.hasUpdated(id)
  if (!hasChanged) {
    let relationships = doc.getIndex('relationships')
    // TODO: this could probably be improved by only navigating updated nodes
    let ids = Object.keys(change.updated)
    for (let _id of ids) {
      let related = relationships.get(_id)
      if (related && related.has(id)) {
        hasChanged = true
        break
      }
    }
  }
  if (hasChanged) cb()
}
