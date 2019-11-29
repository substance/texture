import { PATENT_REF } from '../ArticleConstants';

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
 *
 * @returns {number} The target nodes position.
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
 * @param   {*}      node - The node to start the search from.
 * @param   {string} type - The of node to find.
 *
 * @returns {node|undefined} The requested node, if found.
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

/**
 * Safely get an array of people from the specified citation.
 *
 * This function allows you to get an array of contributors for the specified citation. It came about from needing a
 * consistent single method call to get a list of people regardless of the citation type, and in all cases to return
 * the desired list or an empty array.
 *
 * @export
 * @param   {*} citation - the citation to extract the people list from.
 *
 * @returns {Array} An array of people.
 */
export function getPeopleFromCitation(citation)
{
  let people = [];
  switch(citation.type)
  {
    case PATENT_REF:
      people = citation.inventors || [];
      break;

    default:
      people = citation.authors || [];
  }
  return people;
}

/**
 * Sorts citations by their citation order in the manuscript.
 *
 * Sorts citations by there citation order in the document.
 * Note: This function is intented to be used in [].sort().
 *
 * @export
 * @param   {*} a - The first citation to compare.
 * @param   {*} b - The second citation to compare.
 *
 * @returns {number} 0 if citations match, 1 if A should come before B, and -1 if B should come before A.
 */
export function sortCitationsByPosition(a, b)
{
  return getPos(a) - getPos(b);
}

/**
 * Sorts citations by Author(s) name, then publication year
 *
 * Sorts citations by author name, falling back to year if names all match.
 * Note: This function is intented to be used in [].sort().
 *
 * @export
 * @param   {*} a - The first citation to compare.
 * @param   {*} b - The second citation to compare.
 *
 * @returns {number} 0 if citations match, 1 if A should come before B, and -1 if B should come before A.
 */
export function sortCitationsByNameYear(a, b)
{
  let authorStringA = getPeopleFromCitation(a).reduce((acc, authorRef) => {
    return acc += a.document.get(authorRef).name;
  }, "");

  let authorStringB = getPeopleFromCitation(b).reduce((acc, authorRef) => {
    return acc += b.document.get(authorRef).name;
  }, "");

  // 1st: Try and sort by Author name.
  if (authorStringA < authorStringB)
  {
    return -1;
  }
  else if (authorStringA > authorStringB)
  {
    return 1;
  }
  // 2nd: If no match, then try and sort by year.
  else if (a.year < b.year)
  {
    return -1;
  }
  else if (a.year > b.year)
  {
    return 1;
  }
  // 3rd: Still no match, then sort based on their order in the XML.
  else
  {
    return 0;
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
