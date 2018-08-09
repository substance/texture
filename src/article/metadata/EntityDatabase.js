import { DocumentNode, Document, without } from 'substance'
import { BOOLEAN, STRING, MANY, ONE, CHILDREN } from '../../kit'

// TODO: move all of this into InternalArticleSchema

// LEGACY
export class ArticleRecord extends DocumentNode {}

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
  authors: CHILDREN('ref-contrib'),
  editors: CHILDREN('ref-contrib'),
  translators: CHILDREN('ref-contrib'),
  title: STRING,
  volume: STRING,
  edition: STRING,
  publisherLoc: STRING,
  publisherName: STRING,
  year: STRING,
  month: STRING,
  day: STRING,
  pageCount: STRING,
  series: STRING,
  doi: STRING,
  isbn: STRING,
  pmid: STRING
}

export class Chapter extends BibliographicEntry {}

Chapter.schema = {
  type: 'chapter',
  title: STRING, // <chapter-title>
  containerTitle: STRING, // <source>
  volume: STRING,
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'),
  translators: CHILDREN('ref-contrib'),
  edition: STRING,
  publisherLoc: STRING,
  publisherName: STRING,
  year: STRING,
  month: STRING,
  day: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  elocationId: STRING,
  series: STRING,
  doi: STRING, // <pub-id pub-id-type="doi">
  isbn: STRING, // <pub-id pub-id-type="isbn">
  pmid: STRING // <pub-id pub-id-type="pmid">
}

export class DataPublication extends BibliographicEntry {}

DataPublication.schema = {
  type: 'data-publication',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  containerTitle: STRING, // <source>
  year: STRING,
  month: STRING,
  day: STRING,
  accessionId: STRING,
  arkId: STRING,
  archiveId: STRING,
  doi: STRING
}

export class MagazineArticle extends BibliographicEntry {}

MagazineArticle.schema = {
  type: 'magazine-article',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  containerTitle: STRING, // <source>
  year: STRING,
  month: STRING,
  day: STRING,
  volume: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  doi: STRING
}

export class NewspaperArticle extends BibliographicEntry {}

NewspaperArticle.schema = {
  type: 'newspaper-article',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  containerTitle: STRING, // <source>
  year: STRING,
  month: STRING,
  day: STRING,
  volume: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  doi: STRING,
  edition: STRING,
  partTitle: STRING
}

export class Patent extends BibliographicEntry {}

Patent.schema = {
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  type: '_patent',
  inventors: CHILDREN('ref-contrib'),
  assignee: STRING,
  title: STRING,
  containerTitle: STRING, // <source>
  year: STRING,
  month: STRING,
  day: STRING,
  patentNumber: STRING,
  patentCountry: STRING,
  doi: STRING
}

export class JournalArticle extends BibliographicEntry {}

JournalArticle.schema = {
  type: 'journal-article',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  editors: CHILDREN('ref-contrib'),
  containerTitle: STRING, // <source>
  volume: STRING,
  issue: STRING,
  year: STRING,
  month: STRING,
  day: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  elocationId: STRING,
  doi: STRING,
  pmid: STRING
}

export class ConferencePaper extends BibliographicEntry {}

ConferencePaper.schema = {
  type: 'conference-paper',
  title: STRING, // <article-title>
  authors: CHILDREN('ref-contrib'),
  confName: STRING,
  confLoc: STRING,
  containerTitle: STRING, // <source>
  year: STRING,
  month: STRING,
  day: STRING,
  fpage: STRING,
  lpage: STRING,
  pageRange: STRING,
  elocationId: STRING,
  doi: STRING
}

export class Report extends BibliographicEntry {
  getGuid() {
    return this.isbn
  }
}

Report.schema = {
  type: 'report',
  authors: CHILDREN('ref-contrib'),
  sponsors: CHILDREN('ref-contrib'),
  title: STRING,
  year: STRING,
  month: STRING,
  day: STRING,
  publisherName: STRING,
  publisherLoc: STRING,
  series: STRING,
  isbn: STRING,
  doi: STRING
}

export class Software extends BibliographicEntry {}

Software.schema = {
  type: 'software',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  version: STRING,
  publisherLoc: STRING,
  publisherName: STRING,
  year: STRING,
  month: STRING,
  day: STRING,
  doi: STRING
}

export class Thesis extends BibliographicEntry {}

Thesis.schema = {
  type: 'thesis',
  title: STRING,
  authors: CHILDREN('ref-contrib'),
  year: STRING,
  month: STRING,
  day: STRING,
  publisherLoc: STRING,
  publisherName: STRING,
  doi: STRING
}

export class Webpage extends BibliographicEntry {}

Webpage.schema = {
  type: 'webpage',
  title: STRING,
  // E.g. website name, where the page appeared
  containerTitle: STRING, // <source>
  authors: CHILDREN('ref-contrib'),
  year: STRING,
  month: STRING,
  day: STRING,
  publisherLoc: STRING,
  uri: STRING
}

export class Person extends DocumentNode {}

Person.schema = {
  type: 'person',
  givenNames: STRING,
  surname: STRING,
  prefix: STRING,
  suffix: STRING,
  email: STRING,
  orcid: STRING,
  group: ONE('group'),
  affiliations: MANY('organisation'),
  awards: MANY('award'),
  equalContrib: BOOLEAN,
  corresp: BOOLEAN,
  deceased: BOOLEAN
}

/* Holds data for persons and instituions/groups in references */
export class RefContrib extends DocumentNode {}

RefContrib.schema = {
  type: 'ref-contrib',
  name: STRING, // either family name or institution name
  givenNames: STRING
}

export class Group extends DocumentNode {}

Group.schema = {
  type: 'group',
  name: STRING,
  email: STRING,
  affiliations: MANY('organisation'),
  awards: MANY('award'),
  equalContrib: BOOLEAN,
  corresp: BOOLEAN
}

export class Organisation extends DocumentNode {}

Organisation.schema = {
  type: 'organisation',
  name: STRING,
  division1: STRING,
  division2: STRING,
  division3: STRING,
  // Consider switching to address-line1,2,3
  street: STRING,
  addressComplements: STRING,
  city: STRING,
  state: STRING,
  postalCode: STRING,
  country: STRING,
  phone: STRING,
  fax: STRING,
  email: STRING,
  uri: STRING
}

export class Award extends DocumentNode {}

Award.schema = {
  type: 'award',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
}

export class Keyword extends DocumentNode {}

Keyword.schema = {
  type: 'keyword',
  name: STRING,
  category: STRING,
  language: STRING
}

export class Subject extends DocumentNode {}

Subject.schema = {
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  type: '_subject',
  name: STRING,
  category: STRING,
  language: STRING
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
