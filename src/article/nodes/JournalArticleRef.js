import Reference from './Reference'
import { TEXT, CHILDREN, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

/*
  <element-citation publication-type="journal">
    <day>06</day>
    <fpage>1141</fpage>
    <lpage>1144</lpage>
    <month>11</month>
    <volume>282</volume>
    <year>1998</year>
    <pub-id pub-id-type="doi">10.1126/science.282.5391.1141</pub-id>
    <pub-id pub-id-type="pmid">9804555</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Baukrowitz</surname>
        <given-names>T</given-names>
      </name>
    </person-group>
    <source>Science</source>
    <article-title>PIP<sub id="sub-1">2</sub> and PIP as determinants ...</article-title>
  </element-citation>
*/
export default class JournalArticleRef extends Reference {}
JournalArticleRef.schema = {
  type: 'journal-article-ref', // publication-type="journal"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  containerTitle: STRING, // <source>: label this 'Journal' or 'Publication' as in Zotero?
  volume: STRING, // <volume>
  issue: STRING, // <issue>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  pmid: STRING, // <pub-id pub-id-type="pmid">
  issn: STRING // <pub-id pub-id-type="pmid">
}
