import { DocumentNode, CONTAINER, STRING } from 'substance'

export default class Abstract extends DocumentNode {}
Abstract.schema = {
  type: 'abstract',
  abstractType: STRING,
  content: CONTAINER('paragraph')
}
