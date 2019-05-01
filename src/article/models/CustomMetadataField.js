import { CHILDREN, DocumentNode, STRING } from 'substance'

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
  values: CHILDREN('custom-metadata-value')
}
