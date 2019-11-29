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
    <pub-id pub-id-type="pmcid">PMC12345</pub-id>
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
  // Texture internal
  type: 'journal-article-ref', // publication-type="journal"

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>: label this 'Journal' or 'Publication' as in Zotero?

  // eLife optional fields
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  pmid: STRING, // <pub-id pub-id-type="pmid">
  pmcid: STRING, // <pub-id pub-id-type="pmcid">
  comment: STRING, // <comment>

  // eLife unused fields.
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  issue: STRING, // <issue>
  pageRange: STRING, // <page-range>
  month: STRING, // <month>
  day: STRING // <day>
}
