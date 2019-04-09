/*
  Ensures the first contrib-group is tagged as authors and second as editors.

  FIXME: this is an arbitrary choice and should not be done this way.
  Instead, come up with a clearer specification and find a general solution
  for this transformation.
*/
export default class NormalizeContribGroup {
  import (dom) {
    let contribGroups = dom.findAll('article-meta > contrib-group')
    if (contribGroups[0]) {
      _normalizeContribGroup(contribGroups[0], 'author')
    }
    if (contribGroups[1]) {
      _normalizeContribGroup(contribGroups[1], 'editor')
    }
    if (contribGroups.length > 2) {
      console.warn(`Only the first 2 found contrib-groups (authors, editors) will be editable.`)
    }
  }

  export () {
    // nothing
  }
}

function _normalizeContribGroup (contribGroup, targetType) {
  contribGroup.attr('content-type', targetType)
}
