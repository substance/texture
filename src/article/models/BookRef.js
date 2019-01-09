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
  type: 'book-ref',
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  translators: CHILDREN('ref-contrib'), // <person-group person-group-type="translator">
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  volume: STRING, // <volume>
  edition: STRING, // <editor>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  pageCount: STRING, // <page-count>
  series: STRING, // <series>
  doi: STRING, // <pub-id pub-id-type="doi">
  isbn: STRING, // <pub-id pub-id-type="isbn">
  pmid: STRING // <pub-id pub-id-type="pmid">
}
