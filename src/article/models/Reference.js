import { DocumentNode } from 'substance'

// Note: this is used as a indicator class for all types of references
export default class Reference extends DocumentNode {}

Reference.schema = {
  type: 'reference'
}
