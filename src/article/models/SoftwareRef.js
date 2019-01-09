import { CHILDREN, TEXT, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="software">
    <day>19</day>
    <month>3</month>
    <publisher-name>Zenodo</publisher-name>
    <version>2.0.1</version>
    <year>2018</year>
    <pub-id pub-id-type="doi">10.5281/zenodo.1203712</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Willner</surname>
        <given-names>Sven</given-names>
      </name>
      <name>
        <surname>Gieseke</surname>
        <given-names>Robert</given-names>
      </name>
    </person-group>
    <source>pyhector</source>
  </element-citation>
*/
export default class SoftwareRef extends Reference {}
SoftwareRef.schema = {
  type: 'software-ref', // publication-type="software"
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  version: STRING, // <version>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  doi: STRING // <pub-id pub-id-type="doi">
}
