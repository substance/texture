import { DocumentNode, STRING, CONTAINER, BOOLEAN } from 'substance'

export default class SupplementaryFile extends DocumentNode {
  static getTemplate () {
    return {
      type: 'supplementary-file',
      legend: [{ type: 'paragraph' }]
    }
  }

  static get refType () {
    return 'file'
  }
}

SupplementaryFile.schema = {
  type: 'supplementary-file',
  label: STRING,
  mimetype: STRING,
  href: STRING,
  remote: BOOLEAN,
  legend: CONTAINER('paragraph')
}
