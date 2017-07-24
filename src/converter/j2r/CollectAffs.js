import { uuid } from 'substance'
import { JATS } from '../../article'

/*
  In our restriction all <aff> elements must be defined
  in <article-meta>. At all other places an <xref> must be
  used instead.

  This transformation pulls all affs into one place
  and inserts an <xref> where necessary.
*/
export default class CollectAffs {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let allAffs = dom.findAll('aff')
    let articleMetaSchema = JATS.getElementSchema('article-meta')
    let pos = articleMetaSchema.findLastValidPos(articleMeta, 'aff')
    allAffs.forEach((aff) => {
      if (_needReplace(aff)) {
        _replaceAffWithXref(aff)
        articleMeta.insertAt(pos++, aff)
      }
    })
  }

}

const AFF_PARENTS = ['article-meta', 'aff-alternatives']

function _needReplace(aff) {
  let parentTagname = aff.parentNode.tagName
  return AFF_PARENTS.indexOf(parentTagname) < 0
}

function _replaceAffWithXref(aff) {
  const doc = aff.getOwnerDocument()
  let affId = aff.attr('id')
  if (!affId) {
    affId = uuid()
    aff.attr('id', affId)
  }
  let xref = doc.createElement('xref')
  xref.attr({
    'ref-type': 'aff',
    'rid': affId
  })
  aff.parentNode.replaceChild(aff, xref)
}
