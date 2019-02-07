import { DocumentNode, STRING } from 'substance'

export default class Funder extends DocumentNode {
  toString () {
    return this.institution
  }
}
Funder.schema = {
  type: 'funder',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
}
