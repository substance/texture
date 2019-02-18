import { DocumentNode, STRING } from 'substance'

export default class Organisation extends DocumentNode {
  toString () {
    return this.render()
  }

  render (options = {}) {
    let { institution, division1, division2, division3 } = this
    let result = institution ? [ institution ] : '???'
    // TODO: do we really want this? Because the divisions might
    // be necessary to really understand the displayed name
    if (!options.short && institution) {
      if (division1) {
        result.push(', ', division1)
      }
      if (division2) {
        result.push(', ', division2)
      }
      if (division3) {
        result.push(', ', division3)
      }
    }
    return result
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
