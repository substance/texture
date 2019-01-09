import { DocumentNode, STRING } from 'substance'

export default class Organisation extends DocumentNode {
  toString () {
    return this.institution
  }
}
Organisation.schema = {
  type: 'organisation',
  institution: STRING,
  division1: STRING,
  division2: STRING,
  division3: STRING,
  // Consider switching to address-line1,2,3
  street: STRING,
  addressComplements: STRING,
  city: STRING,
  state: STRING,
  postalCode: STRING,
  country: STRING,
  phone: STRING,
  fax: STRING,
  email: STRING,
  uri: STRING
}
