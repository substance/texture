import { DocumentSchema, XMLElementNode, DocumentNode } from 'substance'
import { BOOLEAN, STRING, STRING_ARRAY, MANY, ONE, CHILDREN } from '../kit'
import { INTERNAL_BIBR_TYPES } from './ArticleConstants'
import InternalArticleDocument from './InternalArticleDocument'
// TODO: rename this to *Schema
import TextureArticleSchema from './TextureArticle'

/*
  TODO: we want to move away from a JATS oriented internal model.

  The internal model structures the data in different categories: content vs metadata.
  It is a challenge to define the boundary between these two categories.
  Here are some criteria:
  - Is the content displayed in a classical manuscript?
  - May the content contain citations, or references to other displayed elements?
*/

class Article extends XMLElementNode {}
Article.schema = {
  type: 'article',
  _childNodes: CHILDREN('metadata', 'content')
}

class ArticleRecord extends DocumentNode {}
ArticleRecord.schema = {
  type: 'article-record',
  articleIds: STRING_ARRAY,
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

class Metadata extends XMLElementNode {}
Metadata.schema = {
  type: 'metadata',
  _childNodes: CHILDREN('article-record', 'authors', 'editors', 'groups', 'affiliations', 'awards')
}

class Affiliations extends XMLElementNode {}
Affiliations.schema = {
  type: 'affiliations',
  _childNodes: CHILDREN(...INTERNAL_BIBR_TYPES)
}

class Authors extends XMLElementNode {}
Authors.schema = {
  type: 'authors',
  _childNodes: CHILDREN('person')
}

class Editors extends XMLElementNode {}
Editors.schema = {
  type: 'editors',
  _childNodes: CHILDREN('person')
}

class Groups extends XMLElementNode {}
Groups.schema = {
  type: 'groups',
  _childNodes: CHILDREN('group')
}

class Awards extends XMLElementNode {}
Awards.schema = {
  type: 'awards',
  _childNodes: CHILDREN('award')
}

// TODO: as this node has a fixed layout, we might want to use a classical DocumentNode
// But this needs support for CSS select
class Content extends XMLElementNode {}
Content.schema = {
  type: 'content',
  _childNodes: CHILDREN('front', 'body', 'back')
}

class Front extends XMLElementNode {}
Front.schema = {
  type: 'front',
  _childNodes: CHILDREN('title', 'abstract')
}

class Back extends XMLElementNode {}
Back.schema = {
  type: 'back',
  _childNodes: CHILDREN('references', 'footnotes')
}

class Title extends TextureArticleSchema.getNodeClass('article-title') {}
Title.type = 'title'

class References extends XMLElementNode {}
References.schema = {
  type: 'references',
  _childNodes: CHILDREN(...INTERNAL_BIBR_TYPES)
}

class Footnotes extends XMLElementNode {}
Footnotes.schema = {
  type: 'footnotes',
  _childNodes: CHILDREN('fn')
}

// TODO: move all of this into InternalArticleSchema

class BibliographicEntry extends DocumentNode {}
BibliographicEntry.schema = {
  type: 'bibr'
}

class Book extends BibliographicEntry {}
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

class Chapter extends BibliographicEntry {}
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

class ConferencePaper extends BibliographicEntry {}
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

class DataPublication extends BibliographicEntry {}
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

class JournalArticle extends BibliographicEntry {}
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

class MagazineArticle extends BibliographicEntry {}
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

class NewspaperArticle extends BibliographicEntry {}
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

class Patent extends BibliographicEntry {}
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

class Report extends BibliographicEntry {
  getGuid () {
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

class Software extends BibliographicEntry {}
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

class Thesis extends BibliographicEntry {}
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

class Webpage extends BibliographicEntry {}
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

class Person extends DocumentNode {}
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

class Award extends DocumentNode {}
Award.schema = {
  type: 'award',
  institution: STRING,
  fundRefId: STRING,
  awardId: STRING
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

class Keyword extends DocumentNode {}
Keyword.schema = {
  type: 'keyword',
  name: STRING,
  category: STRING,
  language: STRING
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

class Subject extends DocumentNode {}
Subject.schema = {
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  type: '_subject',
  name: STRING,
  category: STRING,
  language: STRING
}

const InternalArticleSchema = new DocumentSchema({
  name: 'TextureInternalArticle',
  version: '0.1.0',
  DocumentClass: InternalArticleDocument
})

InternalArticleSchema.addNodes([
  Article,
  // metadata
  Metadata,
  ArticleRecord,
  Affiliations,
  Authors,
  Awards,
  Groups,
  Editors,
  Keyword,
  Subject,
  // entities used in metadata
  Award,
  Group,
  Person,
  Organisation,
  // content
  Content,
  Front,
  Title,
  Back,
  References,
  Footnotes,
  // bibliography
  Book,
  Chapter,
  ConferencePaper,
  DataPublication,
  JournalArticle,
  MagazineArticle,
  NewspaperArticle,
  Report,
  Patent,
  Software,
  Thesis,
  Webpage,
  // entity used in bibliography
  RefContrib
])

// Elements taken from the JATS spec
// TODO: make sure that we do not need to modify them, e.g. marking them as inline nodes
InternalArticleSchema.addNodes([
  'abstract',
  'body',
  'fn',
  'p',
  // formatting
  'bold',
  'fixed-case',
  'italic',
  'monospace',
  'overline',
  'roman',
  'sans-serif',
  'sc',
  'strike',
  'sub',
  'sup',
  'underline',
  'ruby',
  // annos and inline-nodes
  'abbrev',
  'break',
  'chem-struct',
  'ext-link',
  'hr',
  'named-content',
  'inline-formula',
  'inline-graphic',
  'styled-content',
  'x',
  'xref'
].map(name => TextureArticleSchema.getNodeClass(name)))

export default InternalArticleSchema