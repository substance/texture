import { DocumentNode, STRING } from 'substance'

export default class Award extends DocumentNode {
  toString () {
    return this.institution
  }
}
Award.schema = {
  type: 'award',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
}
