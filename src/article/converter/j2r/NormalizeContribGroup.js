/*
  Ensures the first contrib-group is tagged as authors and second as editors
*/
export default class NormalizeContribGroup {

  import(dom) {
    let contribGroups = dom.findAll('contrib-group')
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

  export() {
    // nothing
  }
}


function _normalizeContribGroup(contribGroup, targetType) {
  contribGroup.attr('content-type', targetType)
}
