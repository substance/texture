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
  // Texture internal
  type: 'webpage-ref', // publication-type="webpage"

  // eLife required fields
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>
  uri: STRING, // <ext-link ext-link-type="uri">

  // eLife optional fields
  year: STRING, // <year>

  // FIXME (#233): The ISO8601 value should be computed.
  accessedDate: STRING, // <date-in-citation>
  accessedDateIso8601: STRING, // <date-in-citation iso-8601-date="1995-09-10">

  // eLife unused
  month: STRING, // <month>
  day: STRING // <day>
}
