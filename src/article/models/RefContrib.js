import { DocumentNode, STRING } from 'substance'

/* Holds data for persons and instituions/groups in references */
export default class RefContrib extends DocumentNode {}
RefContrib.schema = {
  type: 'ref-contrib',
  name: STRING, // either family name or institution name
  givenNames: STRING
}
