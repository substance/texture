import { DocumentNode, STRING } from 'substance'

export default class CustomMetadataValue extends DocumentNode {
  static getTemplate () {
    return {
      type: 'custom-metadata-value'
    }
  }

  isEmpty () {
    return this.length === 0
  }
}
CustomMetadataValue.schema = {
  type: 'custom-metadata-value',
  content: STRING
}
