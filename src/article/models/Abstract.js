import { DocumentNode, CHILDREN, STRING } from 'substance'

export default class Abstract extends DocumentNode {}
Abstract.schema = {
  type: 'abstract',
  abstractType: STRING,
  content: CHILDREN('paragraph')
}
