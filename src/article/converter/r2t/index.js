// import PruneText from './PruneText'
import WrapDispQuoteContent from './WrapDispQuoteContent'
import Sec2Heading from './Sec2Heading'
import UpdateDocType from './UpdateDocType'
import FnGroupConverter from './FnGroupConverter'
import ConvertFig from './ConvertFig'
import ConvertTable from './ConvertTable'
import ConvertTableWrap from './ConvertTableWrap'
import ConvertSigBlock from './ConvertSigBlock'
import PruneEmptyElements from './PruneEmptyElements'
import ConvertReflist from './ConvertReflist'
import ConvertArticleMeta from './ConvertArticleMeta'
import ConvertXref from './ConvertXref'
import ConvertList from './ConvertList'
import InternalArticleSchema from '../../InternalArticleSchema'
import InternalArticle from '../../InternalArticleDocument'

import jats2internal from './jats2internal'

// ATTENTION: the order of converters is critical,
// as some of them need to do insert nodes in a way
// that adheres to the schema
// ATM
// const trafos = [
//   PruneEmptyElements,
//   ConvertArticleMeta,
//   ConvertReflist, // extracts publication entities
//   ConvertSigBlock,
//   FnGroupConverter,
//   ConvertFig,
//   ConvertTable,
//   ConvertTableWrap,
//   ConvertList,
//   WrapDispQuoteContent,
//   Sec2Heading,
//   ConvertXref,
//   UpdateDocType
//   // TODO: is PruneText really necessary again?
//   // PruneText,
// ].map(C => new C())

const converters = []

export { jats2internal }

// NOTE: exporters are called in inverse order
export function internal2jats (dom, api) {
}
