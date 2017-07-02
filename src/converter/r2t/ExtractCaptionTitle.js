import { findChild } from '../util/domHelpers'
import { TextureJATS } from '../../article'

/*
  In Texture we decided to pull the title out of the caption
  as this more general.
*/
export default class ExtractCaptionTitle {

  import(dom) {
    dom.findAll('caption').forEach(_extractCaptionTitle)
  }

  export(dom) {
    dom.findAll('caption').forEach(_wrapCaptionTitle)
  }

}

function _extractCaptionTitle(caption) {
  let parentNode = caption.parentNode
  let titleEl = findChild(caption, 'title')
  if (titleEl) {
    let schema = TextureJATS.getElementSchema(parentNode.tagName)
    let pos = schema.findLastValidPos(parentNode, 'title')
    parentNode.insertAt(pos, titleEl)
  }
}

function _wrapCaptionTitle(caption) {
  let parentNode = caption.parentNode
  let titleEl = findChild(parentNode, 'title')
  if (titleEl) {
    caption.insertAt(0, titleEl)
  }
}