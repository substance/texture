import PruneText from './PruneText'
import WrapAff from './WrapAff'
import WrapAbstractContent from './WrapAbstractContent'
import WrapBodyContent from './WrapBodyContent'
import WrapDispQuoteContent from './WrapDispQuoteContent'
import Sec2Heading from './Sec2Heading'
import ExtractCaptionTitle from './ExtractCaptionTitle'
import UpdateDocType from './UpdateDocType'
import TransformAff from './TransformAff'
import TransformContrib from './TransformContrib'
import ConvertContentLoc from './ConvertContentLoc'
import ConvertSigBlock from './ConvertSigBlock'
import UnifyPublicationHistory from './UnifyPublicationHistory'
import NormalizeHistoryDates from './NormalizeHistoryDates'
import PruneEmptyElements from './PruneEmptyElements'

// ATTENTION: the order of converters is critical,
// as some of them need to do insert nodes in a way
// that adheres to the schema
// ATM
const trafos = [
  PruneEmptyElements,
  UnifyPublicationHistory,
  NormalizeHistoryDates,
  ConvertContentLoc,
  ConvertSigBlock,
  ExtractCaptionTitle,
  WrapAff,
  TransformAff,
  TransformContrib,
  WrapAbstractContent,
  WrapBodyContent,
  WrapDispQuoteContent,
  Sec2Heading,
  PruneText,
  UpdateDocType,
].map(C => new C())

export function r2t(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}

// NOTE: exporters are called in inverse order
export function t2r(dom, api) {
  for (let i = trafos.length - 1; i >= 0; i--) {
    trafos[i].export(dom, api)
  }
}
