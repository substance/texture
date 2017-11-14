import { DocumentNode, Document } from 'substance'

export class BookCitation extends DocumentNode {}

BookCitation.schema = {
  type: 'journal-citation',
  pubType: 'journal',
  authors: { type: ['array', 'id'], default: [] },
  editors: { type: ['array', 'id'], default: [] },
  chapterTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true }
}

export class JournalCitation extends DocumentNode {}

JournalCitation.schema = {
  type: 'book-citation',
  authors: { type: ['array', 'id'], default: [] },
  editors: { type: ['array', 'id'], default: [] },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  volume: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  doi: { type: 'string', optional: true}
}

export class Person extends DocumentNode {}

Person.schema = {
  type: 'person',
  givenNames: { type: 'string', optional: true},
  surname: { type: 'string', optional: true},
  prefix: { type: 'string', optional: true},
  suffix: { type: 'string', optional: true}
}

export default class EntityDatabase extends Document {
  /*
    Simple API to find records in the entity database.
  */
  find(qry) {
    let nodesByType = this.getIndex('type')
    let nodeIds = Object.keys(nodesByType.get(qry.type))
    return nodeIds.map((nodeId) => this.get(nodeId))
  }
}
