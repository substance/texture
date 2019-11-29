import { CHILDREN, TEXT, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="thesis">
    <publisher-loc>Nijmegen, The Netherlands</publisher-loc>
    <publisher-name>Radboud University Nijmegen Medical Centre</publisher-name>
    <year>2006</year>
    <person-group person-group-type="author">
      <name>
        <surname>Schneider</surname>
        <given-names>P</given-names>
      </name>
    </person-group>
    <article-title>PhD thesis: Submicroscopic <italic id="italic-2">Plasmodium falciparum</italic> gametocytaemia and the contribution to malaria transmission</article-title>
  </element-citation>
*/
export default class ThesisRef extends Reference {}
ThesisRef.schema = {
  // Texture internal
  type: 'thesis-ref', // publication-type="thesis"

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  publisherName: STRING, // <publisher-name>

  // eLife optional fields
  publisherLoc: STRING, // <publisher-loc>
  doi: STRING, // <pub-id pub-id-type="doi">
  uri: STRING, // <ext-link ext-link-type="uri">

 // eLife unused
  month: STRING, // <month>
  day: STRING // <day>
}
