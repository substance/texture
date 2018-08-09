import { DocumentNode } from 'substance'
import { STRING, MANY } from '../../kit'

export default class ArticleRecord extends DocumentNode {}

ArticleRecord.schema = {
  type: 'article-record',
  authors: MANY('person'),
  editors: MANY('person'),
  volume: STRING,
  issue: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  elocationId: STRING,
  acceptedDate: STRING,
  publishedDate: STRING,
  receivedDate: STRING,
  revReceivedDate: STRING,
  revRequestedDate: STRING
}
