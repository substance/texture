import { DocumentNode, STRING } from 'substance'

export default class Funder extends DocumentNode {
  toString () {
    return this.institution
  }

  render (options = {}) {
    let { awardId, institution } = this
    let result = [ institution ]
    if (!options.short) {
      if (awardId) {
        result.push(', ', awardId)
      }
    }
    return result
  }
}
Funder.schema = {
  type: 'funder',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
}
