import Reference from './Reference'
import { RICH_TEXT_ANNOS } from './modelConstants'
import { CHILDREN, STRING, TEXT } from 'substance'

/*
  <element-citation publication-type="data">
    <day>01</day>
    <month>06</month>
    <year>2016</year>
    <pub-id pub-id-type="accession">GSE69545</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Allison</surname>
        <given-names>KA</given-names>
      </name>
    </person-group>
    <source>NCBI Gene Expression Omnibus</source>
    <data-title>Affinity and Dose of TCR Engagement Yield Proportional Enhancer and Gene Activity in CD4+ T Cells</data-title>
  </element-citation>
*/
export default class DataPublicationRef extends Reference {}
DataPublicationRef.schema = {
  // Texture internal
  type: 'data-publication-ref', // publication-type="data"

  // eLife required fields
  specificUse: STRING, // <element-citation[specific-specificUse]>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <data-title>
  containerTitle: STRING, // <source>

  // eLife optional fields
  authority: STRING, // <pub-id assigning-authority>
  href: STRING,  // <pub-id xlink:href>
  accessionId: STRING, // <pub-id pub-id-type="accession">
  archiveId: STRING, // <pub-id pub-id-type="archive">
  doi: STRING, // <pub-id pub-id-type="doi">

  // eLife unused
  arkId: STRING, // // <pub-id pub-id-type="ark">
  month: STRING, // <month>
  day: STRING // <day>
}
