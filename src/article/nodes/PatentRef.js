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
  // Texture internal
  type: 'patent-ref', // publication-type="patent"

  // eLife required fields
  inventors: CHILDREN('ref-contrib'), // <person-group person-group-type="inventor">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>

  // eLife optional fields
  patentNumber: STRING, // <patent>US20100941530</patent>
  patentCountry: STRING, // <patent country="United States"></patent>
  uri: STRING, // <ext-link ext-link-type="uri">

  // eLife unused
  assignee: STRING, // <collab collab-type="assignee"><named-content>
  month: STRING, // <month>
  day: STRING, // <day>
  doi: STRING // <pub-id pub-id-type="doi">
}
