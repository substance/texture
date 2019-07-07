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
  type: 'data-publication-ref', // publication-type="data"
  title: TEXT(...RICH_TEXT_ANNOS), // <data-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  accessionId: STRING, // <pub-id pub-id-type="accession">
  arkId: STRING, // // <pub-id pub-id-type="ark">
  archiveId: STRING, // <pub-id pub-id-type="archive">
  doi: STRING // <pub-id pub-id-type="doi">
}
