import { DocumentNode } from 'substance'

// Note: this is used as a indicator class for all types of references
export default class Reference extends DocumentNode {
  static get refType () {
    return 'bibr'
  }
}

Reference.schema = {
  type: 'reference'
}
