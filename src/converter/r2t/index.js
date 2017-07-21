import PruneText from './PruneText'
import WrapAbstractContent from './WrapAbstractContent'
import WrapBodyContent from './WrapBodyContent'
import WrapDispQuoteContent from './WrapDispQuoteContent'
import Sec2Heading from './Sec2Heading'
import WrapAff from './WrapAff'
import WrapTransAbstracts from './WrapTransAbstracts'
import ExtractCaptionTitle from './ExtractCaptionTitle'
import UpdateDocType from './UpdateDocType'
import TransformAff from './TransformAff'
import TransformContrib from './TransformContrib'
import PruneEmptyElements from './PruneEmptyElements'

const trafos = [
  PruneText,
  WrapAbstractContent,
  WrapBodyContent,
  WrapDispQuoteContent,
  Sec2Heading,
  WrapAff,
  WrapTransAbstracts,
  ExtractCaptionTitle,
  UpdateDocType,
  TransformAff,
  TransformContrib,
  PruneEmptyElements
].map(C => new C())

export function r2t(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}

export function t2r(dom, api) {
  for (let i = trafos.length - 1; i >= 0; i--) {
    trafos[i].export(dom, api)
  }
}
