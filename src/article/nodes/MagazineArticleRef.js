import { TEXT, CHILDREN, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="magazine">
    <person-group person-group-type="author">
      <name>
        <surname>Craig</surname>
        <given-names>DJ</given-names>
      </name>
    </person-group>
    <year>2017</year>
    <article-title>A voice for women and girls</article-title>
    <source>Columbia Magazine</source>
    <volume>Fall 2017</volume>
    <fpage>36</fpage>
    <lpage>38</lpage>
  </element-citation>
*/
export default class MagazineArticleRef extends Reference {}
MagazineArticleRef.schema = {
  type: 'magazine-article-ref',
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <month>
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  doi: STRING // <pub-id pub-id-type="doi">
}
