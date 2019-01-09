import { DocumentNode, CHILD, CHILDREN, TEXT, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Metadata extends DocumentNode {}
Metadata.schema = {
  type: 'metadata',
  authors: CHILDREN('person'),
  editors: CHILDREN('person'),
  groups: CHILDREN('group'),
  organisations: CHILDREN('organisation'),
  awards: CHILDREN('award'),
  // TODO: this might change in a similar way as we gonna approach Figure metadata, where there can be multiple fields with multiple values
  keywords: CHILDREN('keyword'),
  subjects: CHILDREN('subject'),
  volumne: STRING,
  issue: STRING,
  issueTitle: TEXT(...RICH_TEXT_ANNOS),
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  elocationId: STRING,
  acceptedDate: STRING,
  publishedDate: STRING,
  receivedDate: STRING,
  revReceivedDate: STRING,
  revRequestedDate: STRING,
  permission: CHILD('permission')
}
