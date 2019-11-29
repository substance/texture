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
  // Texture internal
  type: 'software-ref', // publication-type="software"

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  title: TEXT(...RICH_TEXT_ANNOS), // <data-title>
  containerTitle: STRING, // <source>

  // eLife optional fields
  year: STRING, // <year>
  uri: STRING, // <ext-link ext-link-type="uri">
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  doi: STRING, // <pub-id pub-id-type="doi">
  version: STRING, // <version>

    // eLife unused
  month: STRING, // <month>
  day: STRING // <day>
}
