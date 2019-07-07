import { CHILDREN, TEXT, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="report">
    <month>06</month>
    <publisher-loc>Monrovia, Liberia</publisher-loc>
    <publisher-name>NMCP, LISGIS, and ICF International</publisher-name>
    <year>2012</year>
    <person-group person-group-type="author">
      <collab>
        <named-content content-type="name">National Malaria Control Program - Ministry of Health and Social Welfare</named-content>
      </collab>
    </person-group>
    <person-group person-group-type="sponsor">
      <collab>
        <named-content content-type="name">United States Agency for International Development</named-content>
      </collab>
    </person-group>
    <source>Liberia Malaria Indicator Survey 2011</source>
  </element-citation>
*/
export default class ReportRef extends Reference {}
ReportRef.schema = {
  type: 'report-ref', // publication-type="report"
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  sponsors: CHILDREN('ref-contrib'), // <person-group person-group-type="sponsor">
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  publisherName: STRING, // <publisher-name>
  publisherLoc: STRING, // <publisher-loc>
  series: STRING, // <series>
  isbn: STRING, // <pub-id pub-id-type="isbn">
  doi: STRING // <pub-id pub-id-type="doi">
}
