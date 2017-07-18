import PruneText from './PruneText'
import WrapAbstractContent from './WrapAbstractContent'
import WrapBodyContent from './WrapBodyContent'
import Sec2Heading from './Sec2Heading'
import WrapTransAbstracts from './WrapTransAbstracts'
import ExtractCaptionTitle from './ExtractCaptionTitle'
import UpdateDocType from './UpdateDocType'
import TransformAff from './TransformAff'
import TransformContrib from './TransformContrib'

const trafos = [
  PruneText,
  WrapAbstractContent,
  WrapBodyContent,
  Sec2Heading,
  WrapTransAbstracts,
  ExtractCaptionTitle,
  UpdateDocType,
  TransformAff,
  TransformContrib
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
