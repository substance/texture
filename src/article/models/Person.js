import { DocumentNode, STRING, ONE, MANY, CHILDREN, BOOLEAN } from 'substance'

export default class Person extends DocumentNode {}
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
