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
  funders: MANY('funder'),
  equalContrib: BOOLEAN,
  corresp: BOOLEAN
}
