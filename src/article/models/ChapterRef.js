import Reference from './Reference'
import { RICH_TEXT_ANNOS } from './modelConstants'
import { STRING, CHILDREN, TEXT } from 'substance'

/*
  <element-citation publication-type="chapter">
    <day>22</day>
    <fpage>180</fpage>
    <lpage>207</lpage>
    <month>08</month>
    <publisher-loc>Sunderland, MA</publisher-loc>
    <publisher-name>Sinauer Associates</publisher-name>
    <year>1989</year>
    <pub-id pub-id-type="isbn">978-0878936588</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Coyne</surname>
        <given-names>JA</given-names>
      </name>
    </person-group>
    <person-group person-group-type="editor">
      <name>
        <surname>Otte</surname>
        <given-names>D</given-names>
      </name>
    </person-group>
    <source>Speciation and its consequences</source>
    <chapter-title>Two rules of speciation</chapter-title>
  </element-citation>
*/
export default class ChapterRef extends Reference {}
ChapterRef.schema = {
  type: 'chapter-ref',
  title: TEXT(...RICH_TEXT_ANNOS), // <chapter-title>
  containerTitle: STRING, // <source>
  volume: STRING, // <volume>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  translators: CHILDREN('ref-contrib'), // <person-group person-group-type="translator">
  edition: STRING, // <edition>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  elocationId: STRING, // <elocation-id>
  series: STRING, // <series>
  doi: STRING, // <pub-id pub-id-type="doi">
  isbn: STRING, // <pub-id pub-id-type="isbn">
  pmid: STRING // <pub-id pub-id-type="pmid">
}
