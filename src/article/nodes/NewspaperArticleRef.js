import { TEXT, CHILDREN, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="newspaper">
    <day>27</day>
    <edition>International Edition</edition>
    <fpage>21</fpage>
    <month>4</month>
    <part-title>Film</part-title>
    <year>2018</year>
    <person-group person-group-type="author">
      <name>
        <surname>Rose</surname>
        <given-names>Steve</given-names>
      </name>
    </person-group>
    <source>The Guardian</source>
    <article-title>What if superheroes aren’t really the good guys?</article-title>
  </element-citation>
*/
export default class NewspaperArticleRef extends Reference {}
NewspaperArticleRef.schema = {
  type: 'newspaper-article-ref', // publication-type="newspaper"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  doi: STRING, // <pub-id pub-id-type="doi">
  edition: STRING, // <edition>
  partTitle: STRING // <part-title>
}
