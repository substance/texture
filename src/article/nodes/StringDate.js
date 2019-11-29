import { DocumentNode, STRING } from 'substance'

/* Holds data for string-dates found in references */
export default class StringDate extends DocumentNode {
  isEmpty () {
    return !(this.day || this.month || this.year || this.era || this.season || this.iso8601Date)
  }
}

StringDate.schema = {
  type: 'string-date',
  day: STRING, // <day>
  month: STRING, // <month>
  year: STRING, // <year>
  era: STRING, // <era>
  season: STRING, // <season>
  // FIXME (#233): The ISO8601 value should be computed.
  iso8601Date: STRING // <year[iso-8601-date]>
}
