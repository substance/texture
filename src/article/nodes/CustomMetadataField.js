import { DocumentNode, STRING } from 'substance'

export default class CustomMetadataField extends DocumentNode {
  static getTemplate () {
    return {
      type: 'custom-metadata-field'
    }
  }

  isEmpty () {
    return this.length === 0
  }
}
CustomMetadataField.schema = {
  type: 'custom-metadata-field',
  name: STRING,
  // ATTENTION: for now a field consist only of one plain-text value
  // user may use ',' to separate values
  // later on we might opt for a structural approach
  value: STRING
}
