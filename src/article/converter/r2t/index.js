// import PruneText from './PruneText'
import WrapAff from './WrapAff'
import WrapDispQuoteContent from './WrapDispQuoteContent'
import Sec2Heading from './Sec2Heading'
import UpdateDocType from './UpdateDocType'
import FnGroupConverter from './FnGroupConverter'
import ConvertCodeCell from './ConvertCodeCell'
import ConvertReproFig from './ConvertReproFig'
import ConvertFig from './ConvertFig'
import ConvertTable from './ConvertTable'
import ConvertTableWrap from './ConvertTableWrap'
import ConvertContentLoc from './ConvertContentLoc'
import ConvertSigBlock from './ConvertSigBlock'
import UnifyPublicationHistory from './UnifyPublicationHistory'
import NormalizeHistoryDates from './NormalizeHistoryDates'
import PruneEmptyElements from './PruneEmptyElements'
import ConvertRefs from './ConvertRefs'
import ConvertAuthors from './ConvertAuthors'
import ConvertArticleMeta from './ConvertArticleMeta'
import ConvertXref from './ConvertXref'
import ConvertList from './ConvertList'

// ATTENTION: the order of converters is critical,
// as some of them need to do insert nodes in a way
// that adheres to the schema
// ATM
const trafos = [
  PruneEmptyElements,
  UnifyPublicationHistory,
  NormalizeHistoryDates,
  // NOTE: ConvertContentLoc must go before ConvertAuthors otherwise we end up in
  // invalid schema.
  ConvertContentLoc,
  // NOTE: It is important that ConvertAuthors goes before ConvertRefs, as
  // as person records with affiliations (contrib) should have priority over
  // person records in
  ConvertArticleMeta,
  ConvertAuthors, // extracts org and person entities
  ConvertRefs, // extracts publication entities
  ConvertSigBlock,
  FnGroupConverter,
  ConvertCodeCell,
  ConvertReproFig,
  ConvertFig,
  ConvertTable,
  ConvertTableWrap,
  ConvertList,
  WrapAff,
  WrapDispQuoteContent,
  Sec2Heading,
  ConvertXref,
  UpdateDocType
  // TODO: is this really necessary again?
  // PruneText,
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

export {
  PruneEmptyElements,
  UnifyPublicationHistory,
  NormalizeHistoryDates,
  ConvertSigBlock,
  FnGroupConverter,
  ConvertReproFig,
  ConvertFig,
  ConvertTableWrap,
  ConvertList,
  WrapAff,
  WrapDispQuoteContent,
  Sec2Heading,
  ConvertContentLoc,
  ConvertCodeCell,
  UpdateDocType
}
