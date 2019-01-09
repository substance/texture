import { DocumentNode, STRING } from 'substance'

export default class Keyword extends DocumentNode {}
Keyword.schema = {
  type: 'keyword',
  name: STRING,
  category: STRING,
  language: STRING
}
