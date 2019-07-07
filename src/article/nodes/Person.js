import { DocumentNode, STRING, ONE, MANY, CHILDREN, BOOLEAN } from 'substance'
import { extractInitials } from './modelHelpers'

export default class Person extends DocumentNode {
  // not used
  // toString () {
  //   return this.render().join('')
  // }

  render (options = {}) {
    let { prefix, suffix, givenNames, surname } = this
    if (options.short) {
      givenNames = extractInitials(givenNames)
    }
    let result = []
    if (prefix) {
      result.push(prefix, ' ')
    }
    result.push(
      givenNames,
      ' ',
      surname
    )
    if (suffix) {
      result.push(' (', suffix, ')')
    }
    return result
  }
}
Person.schema = {
  type: 'person',
  surname: STRING,
  givenNames: STRING,
  alias: STRING,
  prefix: STRING,
  suffix: STRING,
  email: STRING,
  orcid: STRING,
  group: ONE('group'),
  affiliations: MANY('organisation'),
  funders: MANY('funder'),
  bio: CHILDREN('paragraph'),
  equalContrib: BOOLEAN,
  corresp: BOOLEAN,
  deceased: BOOLEAN
}
