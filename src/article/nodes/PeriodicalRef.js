import { CHILDREN, TEXT, STRING, CHILD } from 'substance'
import Reference from './Reference'
import { RICH_TEXT_ANNOS } from './modelConstants'
import StringDate from './StringDate'

/*
  <element-citation publication-type="periodical">
    <person-group person-group-type="author">
      <name>
        <surname>Schwartz</surname>
        <given-names>J</given-names>
      </name>
    </person-group>
    <string-date><month>September</month> <day>9</day>, <year iso-8601-date="1993-09-09">1993</year></string-date>
    <article-title>Obesity affects economic, social status</article-title>
    <source>The Washington Post</source>
    <fpage>A1</fpage>
    <lpage>A4</lpage>
  </element-citation>
*/
export default class PeriodicalRef extends Reference {}
PeriodicalRef.schema = {
  // Texture internal
  type: 'periodical-ref',

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  stringDate: CHILD(StringDate.type), // <string-date>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>

  // eLife optional fields
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  uri: STRING, // <ext-link ext-link-type="uri">
}
