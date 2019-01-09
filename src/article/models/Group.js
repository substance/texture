import { DocumentNode, STRING, MANY, BOOLEAN } from 'substance'

export default class Group extends DocumentNode {
  toString () {
    return this.name
  }
}
Group.schema = {
  type: 'group',
  name: STRING,
  email: STRING,
  affiliations: MANY('organisation'),
  awards: MANY('award'),
  equalContrib: BOOLEAN,
  corresp: BOOLEAN
}
