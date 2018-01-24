import { DocumentNode, Document, without } from 'substance'

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
  authors: { type: ['person'], default: [] },
  editors: { type: ['person'], default: [] },
  chapterTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  edition: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  pageCount: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true },
  isbn: { type: 'string', optional: true },
  pmid: { type: 'string', optional: true }
}

export class DataPublication extends BibliographicEntry {}

DataPublication.schema = {
  type: 'data-publication',
  authors: { type: ['person'], default: [] },
  dataTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  accessionId: { type: 'string', optional: true },
  arkId: { type: 'string', optional: true },
  archiveId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Periodical extends BibliographicEntry {}

Periodical.schema = {
  type: 'periodical',
  authors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Patent extends BibliographicEntry {}

Patent.schema = {
  type: 'patent',
  inventors: { type: ['person'], default: [] },
  assignee: { type: 'string', optional: true },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
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
  authors: { type: ['person'], default: [] },
  editors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  volume: { type: 'string', optional: true },
  issue: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class ConferenceProceeding extends BibliographicEntry {}

ConferenceProceeding.schema = {
  type: 'conference-proceeding',
  authors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
  confName: { type: 'string', optional: true },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  fpage: { type: 'string', optional: true },
  lpage: { type: 'string', optional: true },
  pageRange: { type: 'string', optional: true },
  elocationId: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class ClinicalTrial extends BibliographicEntry {}

ClinicalTrial.schema = {
  type: 'clinical-trial',
  sponsors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Preprint extends BibliographicEntry {}

Preprint.schema = {
  type: 'preprint',
  authors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  doi: { type: 'string', optional: true }
}

export class Report extends BibliographicEntry {
  getGuid() {
    return this.isbn
  }
}

Report.schema = {
  type: 'report',
  authors: { type: ['person'], default: [] },
  source: { type: 'string', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  publisherName: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  isbn: { type: 'string', optional: true }
}

export class Software extends BibliographicEntry {}

Software.schema = {
  type: 'software',
  authors: { type: ['person'], default: [] },
  title: { type: 'string', optional: true },
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
  authors: { type: ['person'], default: [] },
  articleTitle: { type: 'text', optional: true },
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
  authors: { type: ['person'], default: [] },
  title: { type: 'text', optional: true },
  year: { type: 'string', optional: true },
  month: { type: 'string', optional: true },
  day: { type: 'string', optional: true },
  publisherLoc: { type: 'string', optional: true },
  uri: { type: 'string', optional: true }
}

export class Person extends DocumentNode {}

Person.schema = {
  type: 'person',
  orcid: { type: 'string', optional: true },
  givenNames: { type: 'string', optional: true },
  surname: { type: 'string', optional: true },
  prefix: { type: 'string', optional: true },
  suffix: { type: 'string', optional: true },
  affiliations: { type: ['organisation'], default: [] },
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
  uri: { type: 'string', optional: true },
  members: { type: ['person'], default: [] },
}

export default class EntityDatabase extends Document {
  /*
    Simple API to find records in the entity database.
  */
  find(qry) {
    return this.findByType(qry.type)
  }

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

EntityDatabase.prototype._isEntityDatabase = true
