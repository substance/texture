import { CHILDREN, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="patent">
    <day>17</day>
    <month>03</month>
    <patent country="United States">US20100941530</patent>
    <year>2011</year>
    <person-group person-group-type="inventor">
      <name>
        <surname>Patterson</surname>
        <given-names>JB</given-names>
      </name>
    </person-group>
    <source>United States patent</source>
    <article-title>IRE-1alpha inhibitors</article-title>
  </element-citation>
*/
export default class PatentRef extends Reference {}
PatentRef.schema = {
  type: 'patent-ref', // publication-type="patent"
  inventors: CHILDREN('ref-contrib'), // <person-group person-group-type="inventor">
  assignee: STRING, // <collab collab-type="assignee"><named-content>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  patentNumber: STRING, // <patent>US20100941530</patent>
  patentCountry: STRING, // <patent country="United States"></patent>
  doi: STRING // <pub-id pub-id-type="doi">
}
