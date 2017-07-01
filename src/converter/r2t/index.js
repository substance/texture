import PruneText from './PruneText'
import WrapAbstractContent from './WrapAbstractContent'
import WrapBodyContent from './WrapBodyContent'
import Sec2Heading from './Sec2Heading'
import TransformAff from './TransformAff'
import ExtractCaptionTitle from './ExtractCaptionTitle'

const trafos = [
  PruneText,
  WrapAbstractContent,
  WrapBodyContent,
  Sec2Heading,
  TransformAff,
  ExtractCaptionTitle
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
