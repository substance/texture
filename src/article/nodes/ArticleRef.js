import Reference from './Reference'
import { STRING, CHILDREN } from 'substance'

/*
  <element-citation publication-type="article">
    <year>2016</year>
    <pub-id pub-id-type="doi">10.1101/029983</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Bloss</surname>
        <given-names>CS</given-names>
      </name>
    </person-group>
    <source>bioRxiv</source>
    <article-title>A prospective randomized trial examining...</article-title>
  </element-citation>
*/
export default class ArticleRef extends Reference {}
ArticleRef.schema = {
  type: 'article-ref', // publication-type="article"
  title: STRING, // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  pmid: STRING // <pub-id pub-id-type="pmid">
}
