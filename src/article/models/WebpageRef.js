import { CHILDREN, TEXT, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Reference from './Reference'

/*
  <element-citation publication-type="webpage">
    <day>10</day>
    <month>05</month>
    <uri>http://www.michaeleisen.org/blog/?p=1894</uri>
    <date-in-citation iso-8601-date="1995-09-10">1995-09-10</date-in-citation>
    <year>2016</year>
    <person-group person-group-type="author">
      <name>
        <surname>Eisen</surname>
        <given-names>M</given-names>
      </name>
    </person-group>
    <source>it is NOT junk</source>
    <article-title>The Imprinter of All Maladies</article-title>
  </element-citation>
*/
export default class WebpageRef extends Reference {}
WebpageRef.schema = {
  type: 'webpage-ref', // publication-type="webpage"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  // E.g. website name, where the page appeared
  containerTitle: STRING, // <source>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  accessedDate: STRING, // <date-in-citation iso-8601-date="1995-09-10">
  uri: STRING // <uri>
}
