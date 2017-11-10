import { DocumentNode, Document } from 'substance'

export class BookCitation extends DocumentNode {}

BookCitation.schema = {
  type: 'journal-citation',
  pubType: 'journal',
  authors: { type: ['array', 'entity'], default: [] },
  editors: { type: ['array', 'entity'], default: [] },
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
  authors: { type: ['array', 'entity'], default: [] },
  editors: { type: ['array', 'entity'], default: [] },
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

export class Entity extends DocumentNode {}

Entity.schema = {
  type: 'entity',
  entityType: { type: 'string'},
  // entityId refererences the actual entity, which may change during life time.
  // E.g. an entity could be changed to use a
  targetId: { type: 'id' },
}

export class Person extends DocumentNode {}

Person.schema = {
  type: 'person',
  givenNames: 'string',
  surname: 'string'
}

export default class EntityDatabase extends Document {

}
