import { CHILDREN, TEXT, STRING } from 'substance'
import Reference from './Reference'
import { RICH_TEXT_ANNOS } from './modelConstants'

/*
  <element-citation publication-type="book">
    <publisher-loc>New York</publisher-loc>
    <publisher-name>Oxford University Press</publisher-name>
    <year>2006</year>
    <pub-id pub-id-type="isbn">978-0195301069</pub-id>
    <pub-id pub-id-type="doi">10.1093/acprof:oso/9780195301069.001.0001</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Buzsaki</surname>
        <given-names>G</given-names>
      </name>
    </person-group>
    <source>Rhythms of the Brain</source>
  </element-citation>
*/
export default class BookRef extends Reference {}
BookRef.schema = {
  // Texture internal
  type: 'book-ref',

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  publisherName: STRING, // <publisher-name>

  // eLife optional fields
  chapterTitle: TEXT(...RICH_TEXT_ANNOS), // <chapter-title>
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  edition: STRING, // <edition>
  isbn: STRING, // <pub-id pub-id-type="isbn">
  publisherLoc: STRING, // <publisher-loc>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  comment: STRING, // <comment>

  // eLife unused fields
  translators: CHILDREN('ref-contrib'), // <person-group person-group-type="translator">
  volume: STRING, // <volume>
  month: STRING, // <month>
  day: STRING, // <day>
  pageCount: STRING, // <page-count>
  series: STRING, // <series>
  pmid: STRING // <pub-id pub-id-type="pmid">
}
