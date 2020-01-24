import { DocumentNode, STRING } from 'substance';

export default class Affiliation extends DocumentNode {
  toString() {
    return this.render().join('');
  }

  render(options = {}) {
    let { institution, division1, division2, division3, city, country } = this;
    let result = institution ? [institution] : '???';
    // TODO: do we really want this? Because the divisions might
    // be necessary to really understand the displayed name
    if (!options.short && institution) {
      if (division1) {
        result.push(', ', division1);
      }
      if (division2) {
        result.push(', ', division2);
      }
      if (division3) {
        result.push(', ', division3);
      }

      // FIXME: Rather than the below, should re-architect this function.
      result.reverse();
      if (city) {
        result.push(', ', city);
      }
      if (country) {
        result.push(', ', country);
      }
    }

    return result;
  }
}

Affiliation.schema = {
  type: 'affiliation',
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
};
