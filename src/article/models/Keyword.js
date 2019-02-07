import { DocumentNode, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Keyword extends DocumentNode {}
Keyword.schema = {
  type: 'keyword',
  name: TEXT(...RICH_TEXT_ANNOS),
  category: STRING,
  language: STRING
}
