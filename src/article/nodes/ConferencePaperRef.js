import { TEXT, CHILDREN, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="confproc">
    <conf-name>Proceedings of the 17th Annual Meeting of International Society for Magnetic Resonance in Medicine</conf-name>
    <conf-loc>Hawaii, United States</conf-loc>
    <year>2009</year>
    <person-group person-group-type="author">
      <name>
        <surname>Leemans</surname>
        <given-names>A</given-names>
      </name>
    </person-group>
    <article-title>ExploreDTI: a graphical toolbox for processing, analyzing, and visualizing diffusion MR data</article-title>
  </element-citation>
*/
export default class ConferencePaperRef extends Reference {}
ConferencePaperRef.schema = {
  // Texture internal
  type: 'conference-paper-ref', // publication-type="confproc"

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  confName: STRING, // <conf-name>

  // eLife optional fields
  confLoc: STRING, // <conf-loc>
  confDate: STRING, // <conf-date>
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  uri: STRING, // <ext-link ext-link-type="uri">

  // eLife unused fields.
  containerTitle: STRING, // <source>
  month: STRING, // <month>
  day: STRING, // <day>
  pageRange: STRING // <page-range>
}
