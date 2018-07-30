import { DocumentNode, Document, without } from 'substance'

export class ArticleRecord extends DocumentNode {}

ArticleRecord.schema = {
  type: 'article-record',
  volume: { type: 'string', optional: false, default: '' },
  issue: { type: 'string', optional: false, default: '' },
  fpage: { type: 'string', optional: false, default: '' },
  lpage: { type: 'string', optional: false, default: '' },
  pageRange: { type: 'string', optional: false, default: '' },
  elocationId: { type: 'string', optional: false, default: '' },
  acceptedDate: { type: 'string', optional: false, default: '' },
  publishedDate: { type: 'string', optional: false, default: '' },
  receivedDate: { type: 'string', optional: false, default: '' },
  revReceivedDate: { type: 'string', optional: false, default: '' },
  revRequestedDate: { type: 'string', optional: false, default: '' }
}

// Using an 'abstract base class' to be
// able to identify sub-types via isInstanceOf
export class BibliographicEntry extends DocumentNode {}
BibliographicEntry.schema = {
  type: 'bibr'
}
BibliographicEntry.abstract = true

export class Book extends BibliographicEntry {}

Book.schema = {
  type: 'book',
  authors: { type: ['ref-contrib'], default: [], optional: true },
  editors: { type: ['ref-contrib'], default: [], optional: true },
  translators: { type: ['ref-contrib'], default: [], optional: true },
  title: { type: 'string', optional: true },
  volume: { type: 'string', optional: true },
  edition: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  pageCount: { type: 'string', optional: true },
  series: { type: 'string', optional: true },
  doi: { type: 'string', optional: true },
  isbn: { type: 'string', optional: true },
  pmid: { type: 'string', optional: true }
}

export class Chapter extends BibliographicEntry {}

Chapter.schema = {
  type: 'chapter',
  title: { type: 'string', optional: true }, // <chapter-title>
  containerTitle: { type: 'string', optional: true }, // <source>
  volume: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true }, // <person-group person-group-type="author">
  editors: { type: ['ref-contrib'], default: [], optional: true },
  translators: { type: ['ref-contrib'], default: [], optional: true },
  edition: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  series: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }, // <pub-id pub-id-type="doi">
  isbn: { type: 'string', optional: true }, // <pub-id pub-id-type="isbn">
  pmid: { type: 'string', optional: true } // <pub-id pub-id-type="pmid">
}

export class DataPublication extends BibliographicEntry {}

DataPublication.schema = {
  type: 'data-publication',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  accessionId: { type: 'string', optional: true },
  arkId: { type: 'string', optional: true },
  archiveId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class MagazineArticle extends BibliographicEntry {}

MagazineArticle.schema = {
  type: 'magazine-article',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  volume: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class NewspaperArticle extends BibliographicEntry {}

NewspaperArticle.schema = {
  type: 'newspaper-article',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  volume: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  doi: { type: 'string', optional: true },
  edition: { type: 'string', optional: true },
  partTitle: { type: 'string', optional: true }
}

export class Patent extends BibliographicEntry {}

Patent.schema = {
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  type: '_patent',
  inventors: { type: ['ref-contrib'], default: [], optional: true },
  assignee: { type: 'string', optional: true },
  title: { type: 'string', optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  patentNumber: { type: 'string', optional: true },
  patentCountry: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class JournalArticle extends BibliographicEntry {}

JournalArticle.schema = {
  type: 'journal-article',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  editors: { type: ['ref-contrib'], default: [], optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  volume: { type: 'string', optional: true },
  issue: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true },
  pmid: { type: 'string', optional: true }
}

export class ConferencePaper extends BibliographicEntry {}

ConferencePaper.schema = {
  type: 'conference-paper',
  title: { type: 'string', optional: true }, // <article-title>
  authors: { type: ['ref-contrib'], default: [], optional: true },
  confName: { type: 'string', optional: true },
  confLoc: { type: 'string', optional: true },
  containerTitle: { type: 'string', optional: true }, // <source>
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Report extends BibliographicEntry {
  getGuid() {
    return this.isbn
  }
}

Report.schema = {
  type: 'report',
  authors: { type: ['ref-contrib'], default: [], optional: true },
  sponsors: { type: ['ref-contrib'], default: [], optional: true },
  title: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  series: { type: 'string', optional: true },
  isbn: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Software extends BibliographicEntry {}

Software.schema = {
  type: 'software',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  version: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Thesis extends BibliographicEntry {}

Thesis.schema = {
  type: 'thesis',
  title: { type: 'string', optional: true },
  authors: { type: ['ref-contrib'], default: [], optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Webpage extends BibliographicEntry {}

Webpage.schema = {
  type: 'webpage',
  title: { type: 'string', optional: true },
  // E.g. website name, where the page appeared
  containerTitle: { type: 'string', optional: true }, // <source>
  authors: { type: ['ref-contrib'], default: [], optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  uri: { type: 'string', optional: true }
}

export class Person extends DocumentNode {}

Person.schema = {
  type: 'person',
  givenNames: { type: 'string', optional: true },
  surname: { type: 'string', optional: true },
  prefix: { type: 'string', optional: true },
  suffix: { type: 'string', optional: true },
  email: { type: 'string', optional: true },
  orcid: { type: 'string', optional: true },
  group: { type: 'group', optional: true },
  affiliations: { type: ['organisation'], default: [] },
  awards: { type: ['award'], default: [] },
  equalContrib: { type: 'boolean', optional: true },
  corresp: { type: 'boolean', optional: true },
  deceased: { type: 'boolean', optional: true }
}

/* Holds data for persons and instituions/groups in references */
export class RefContrib extends DocumentNode {}

RefContrib.schema = {
  type: 'ref-contrib',
  name: { type: 'string', optional: true }, // either family name or institution name
  givenNames: { type: 'string', optional: true }
}

export class Group extends DocumentNode {}

Group.schema = {
  type: 'group',
  name: { type: 'string', optional: true },
  email: { type: 'string', optional: true },
  affiliations: { type: ['organisation'], default: [] },
  awards: { type: ['award'], default: [] },
  equalContrib: { type: 'boolean', optional: true },
  corresp: { type: 'boolean', optional: true }
}

export class Organisation extends DocumentNode {}

Organisation.schema = {
  type: 'organisation',
  name: { type: 'string', optional: true },
  division1: { type: 'string', optional: true },
  division2: { type: 'string', optional: true },
  division3: { type: 'string', optional: true },
  // Consider switching to address-line1,2,3
  street: { type: 'string', optional: true },
  addressComplements: { type: 'string', optional: true },
  city: { type: 'string', optional: true },
  state: { type: 'string', optional: true },
  postalCode: { type: 'string', optional: true },
  country: { type: 'string', optional: true },
  phone: { type: 'string', optional: true },
  fax: { type: 'string', optional: true },
  email: { type: 'string', optional: true },
  uri: { type: 'string', optional: true }
}

export class Award extends DocumentNode {}

Award.schema = {
  type: 'award',
  institution: { type: 'string', optional: true },
  fundRefId: { type: 'string', optional: true },
  awardId: { type: 'string', optional: true }
}

export class Keyword extends DocumentNode {}

Keyword.schema = {
  type: 'keyword',
  name: { type: 'string', optional: false, default: '' },
  category: { type: 'string', optional: false, default: '' },
  language: { type: 'string', optional: false, default: '' }
}

export class Subject extends DocumentNode {}

Subject.schema = {
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  type: '_subject',
  name: { type: 'string', optional: false, default: '' },
  category: { type: 'string', optional: false, default: '' },
  language: { type: 'string', optional: false, default: '' }
}

export default class EntityDatabase extends Document {

  findByType(type) {
    let NodeClass = this.schema.getNodeClass(type)
    if (!NodeClass) return []
    let nodesByType = this.getIndex('type')
    let nodeIds = []
    if (NodeClass.abstract) {
      // TODO: would be nice to get sub-types from the schema
      const schema = this.schema
      schema.nodeRegistry.names.forEach((subType) => {
        if (schema.isInstanceOf(subType, type)) {
          nodeIds = nodeIds.concat(Object.keys(nodesByType.get(subType)))
        }
      })
    } else {
      nodeIds = Object.keys(nodesByType.get(type))
    }
    // HACK: we do not want to have one of these in the result
    // how could we generalise this?
    nodeIds = without(nodeIds, 'main-article')
    return nodeIds
  }
}
