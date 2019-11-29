import { CHILDREN, TEXT, STRING } from 'substance'
import Reference from './Reference'
import { RICH_TEXT_ANNOS } from './modelConstants'

/*
  <element-citation publication-type="pre-print">
    <person-group person-group-type="author">
      <name>
        <surname>Li</surname>
        <given-names>H</given-names>
      </name>
    </person-group>
    <year iso-8601-date="2013">2013</year>
    <article-title>Aligning sequence reads clone sequences and assembly contigs with BWA-MEM</article-title>
    <source>arXiv</source>
    <elocation-id>1303.3997}</elocation-id>
    <ext-link ext-link-type="uri" xlink:href="https://arxiv.org/abs/1303.3997">https://arxiv.org/abs/1303.3997</ext-link>
  </element-citation>
*/
export default class PreprintRef extends Reference {}
PreprintRef.schema = {
  // Texture internal
  type: 'preprint-ref',

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>

  // eLife optional fields
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  uri: STRING // <ext-link ext-link-type="uri">
}
