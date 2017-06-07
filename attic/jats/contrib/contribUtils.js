import toDOM from '../../util/toDOM'
import getFullName from '../../util/getFullName'
import { getAffs } from '../aff/affUtils'

/*
  For given contrib node get the assigned affiliation ids as an object
*/
function affsForContrib(node) {
  let el = toDOM(node)
  let xrefs = el.findAll('xref[ref-type=aff]')
  let affs = {}
  xrefs.forEach(function(xref) {
    let affId = xref.getAttribute('rid')
    affs[affId] = true
  })
  return affs
}

/*
  A practical view model for ContribComponent and EditContrib
*/
function getAdapter(node) {
  let doc = node.getDocument()

  return {
    node: node, // the original plain node
    fullName: getFullName(node),
    selectedAffs: affsForContrib(node),
    affs: getAffs(doc),
    // True if node follows strict texture-enforced markup
    strict: node.attributes.generator === 'texture'
  }
}

function saveContrib(editorSession, contribData) {
  editorSession.transaction(function(tx) {
    let node = tx.get(contribData.id)
    let el = toDOM(node)
    let $$ = el.getElementFactory()

    el.innerHTML = ''
    el.append(
      $$('string-name').append(contribData.fullName)
    )

    // Affiliations are represented as xrefs
    contribData.selectedAffs.forEach(function(affId) {
      el.append(
        $$('xref').attr({'ref-type': 'aff', rid: affId})
      )
    })

    let xmlContent = el.innerHTML
    tx.set([node.id, 'xmlContent'], xmlContent)
  })
}

export { affsForContrib, getAdapter, saveContrib}
