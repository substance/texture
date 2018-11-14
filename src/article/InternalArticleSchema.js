import {
  DocumentSchema,
  XMLContainerNode, XMLElementNode, XMLTextElement,
  without
} from 'substance'
import { BOOLEAN, STRING, TEXT, MANY, ONE, CHILDREN, CHILD, DocumentNode, InlineNode } from '../kit'
import { INTERNAL_BIBR_TYPES } from './ArticleConstants'
import InternalArticleDocument from './InternalArticleDocument'
// TODO: rename this to *Schema
import TextureArticleSchema from './TextureArticle'
import TableNode from './TableNode'
import TableCellNode from './TableCellNode'
import ListNode from './XMLListNode'
import ListItemNode from './XMLListItemNode'

const RICH_TEXT_ANNOS = ['bold', 'italic', 'sup', 'sub']

class Article extends XMLElementNode {}
Article.schema = {
  type: 'article',
  _childNodes: CHILDREN('metadata', 'content')
}

class ArticleRecord extends DocumentNode {}
ArticleRecord.schema = {
  type: 'article-record',
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
  revRequestedDate: STRING,
  permission: CHILD('permission')
}

class TranslatableTextElement extends XMLTextElement {
  getTranslations () {
    const doc = this.getDocument()
    return this.translations.map(id => doc.get(id)).filter(Boolean)
  }
}
TranslatableTextElement.schema = {
  translations: CHILDREN('text-translation')
}

class TranslatableContainerElement extends XMLContainerNode {
  getTranslations () {
    const doc = this.getDocument()
    return this.translations.map(id => doc.get(id)).filter(Boolean)
  }
}
TranslatableContainerElement.schema = {
  translations: CHILDREN('container-translation')
}

class Metadata extends XMLElementNode {}
Metadata.schema = {
  type: 'metadata',
  _childNodes: CHILDREN(
    'article-record', 'authors', 'editors', 'groups', 'organisations', 'awards', 'keywords', 'subjects'
  )
}

class Organisations extends XMLElementNode {}
Organisations.schema = {
  type: 'organisations',
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

class DispFormula extends DocumentNode {}
DispFormula.schema = {
  type: 'disp-formula',
  label: STRING,
  content: CHILD('tex-math')
}

class DispQuote extends XMLContainerNode {}
DispQuote.schema = {
  type: 'disp-quote',
  attrib: 'text',
  _childNodes: CHILDREN('p')
}

class Figure extends DocumentNode {
  getContent () {
    return this.getDocument().get(this.content)
  }
  getCaption () {
    return this.getDocument().get(this.caption)
  }
}

Figure.schema = {
  type: 'figure',
  content: CHILD('graphic'),
  title: TEXT(...RICH_TEXT_ANNOS),
  label: STRING,
  caption: CHILD('caption'),
  permission: CHILD('permission')
}

class TableFigure extends Figure {}
TableFigure.schema = {
  type: 'table-figure',
  content: CHILD('table')
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

class Keywords extends XMLElementNode {}
Keywords.schema = {
  type: 'keywords'
}

class Subjects extends XMLElementNode {}
Subjects.schema = {
  type: 'subjects'
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

class Title extends TranslatableTextElement {}
Title.schema = {
  type: 'title',
  content: TEXT(...RICH_TEXT_ANNOS)
}

class Abstract extends TranslatableContainerElement {}
Abstract.type = 'abstract'

// In contrast to TextureJATS, our internal <body> does not have <sec> but <heading> instead
let TextureBody = TextureArticleSchema.getNodeClass('body', 'strict')
const bodyTargetTypes = without(TextureBody.schema.getProperty('_childNodes').targetTypes, 'sec').concat(['heading'])

class Body extends XMLContainerNode {}
Body.schema = {
  type: 'body',
  _childNodes: CHILDREN(...bodyTargetTypes)
}

class Heading extends XMLTextElement {
  getLevel () {
    return Math.max(parseInt(this.getAttribute('level') || '1', 10), 1)
  }
  setLevel (level) {
    level = Math.max(1, level)
    this.setAttribute('level', String(level))
  }

  get level () {
    return this.getLevel()
  }
  set level (level) {
    this.setLevel(level)
  }
}
Heading.type = 'heading'

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

/*
  <element-citation publication-type="book">
    <publisher-loc>New York</publisher-loc>
    <publisher-name>Oxford University Press</publisher-name>
    <year>2006</year>
    <pub-id pub-id-type="isbn">978-0195301069</pub-id>
    <pub-id pub-id-type="doi">10.1093/acprof:oso/9780195301069.001.0001</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Buzsaki</surname>
        <given-names>G</given-names>
      </name>
    </person-group>
    <source>Rhythms of the Brain</source>
  </element-citation>
*/
class BookRef extends BibliographicEntry {}
BookRef.schema = {
  type: 'book-ref',
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  translators: CHILDREN('ref-contrib'), // <person-group person-group-type="translator">
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  volume: STRING, // <volume>
  edition: STRING, // <editor>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  pageCount: STRING, // <page-count>
  series: STRING, // <series>
  doi: STRING, // <pub-id pub-id-type="doi">
  isbn: STRING, // <pub-id pub-id-type="isbn">
  pmid: STRING // <pub-id pub-id-type="pmid">
}

/*
  <element-citation publication-type="chapter">
    <day>22</day>
    <fpage>180</fpage>
    <lpage>207</lpage>
    <month>08</month>
    <publisher-loc>Sunderland, MA</publisher-loc>
    <publisher-name>Sinauer Associates</publisher-name>
    <year>1989</year>
    <pub-id pub-id-type="isbn">978-0878936588</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Coyne</surname>
        <given-names>JA</given-names>
      </name>
    </person-group>
    <person-group person-group-type="editor">
      <name>
        <surname>Otte</surname>
        <given-names>D</given-names>
      </name>
    </person-group>
    <source>Speciation and its consequences</source>
    <chapter-title>Two rules of speciation</chapter-title>
  </element-citation>
*/
class ChapterRef extends BibliographicEntry {}
ChapterRef.schema = {
  type: 'chapter-ref',
  title: TEXT(...RICH_TEXT_ANNOS), // <chapter-title>
  containerTitle: STRING, // <source>
  volume: STRING, // <volume>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  translators: CHILDREN('ref-contrib'), // <person-group person-group-type="translator">
  edition: STRING, // <edition>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  elocationId: STRING, // <elocation-id>
  series: STRING, // <series>
  doi: STRING, // <pub-id pub-id-type="doi">
  isbn: STRING, // <pub-id pub-id-type="isbn">
  pmid: STRING // <pub-id pub-id-type="pmid">
}

/*
  <element-citation publication-type="confproc">
    <conf-name>Proceedings of the 17th Annual Meeting of International Society for Magnetic Resonance in Medicine</conf-name>
    <conf-loc>Hawaii, United States</conf-loc>
    <year>2009</year>
    <person-group person-group-type="author">
      <name>
        <surname>Leemans</surname>
        <given-names>A</given-names>
      </name>
    </person-group>
    <article-title>ExploreDTI: a graphical toolbox for processing, analyzing, and visualizing diffusion MR data</article-title>
  </element-citation>
*/
class ConferencePaperRef extends BibliographicEntry {}
ConferencePaperRef.schema = {
  type: 'conference-paper-ref', // publication-type="confproc"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  confName: STRING, // <conf-name>
  confLoc: STRING, // <conf-loc>
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  elocationId: STRING, // <elocation-id>
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="data">
    <day>01</day>
    <month>06</month>
    <year>2016</year>
    <pub-id pub-id-type="accession">GSE69545</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Allison</surname>
        <given-names>KA</given-names>
      </name>
    </person-group>
    <source>NCBI Gene Expression Omnibus</source>
    <data-title>Affinity and Dose of TCR Engagement Yield Proportional Enhancer and Gene Activity in CD4+ T Cells</data-title>
  </element-citation>
*/
class DataPublicationRef extends BibliographicEntry {}
DataPublicationRef.schema = {
  type: 'data-publication-ref', // publication-type="data"
  title: TEXT(...RICH_TEXT_ANNOS), // <data-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  accessionId: STRING, // <pub-id pub-id-type="accession">
  arkId: STRING, // // <pub-id pub-id-type="ark">
  archiveId: STRING, // <pub-id pub-id-type="archive">
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="journal">
    <day>06</day>
    <fpage>1141</fpage>
    <lpage>1144</lpage>
    <month>11</month>
    <volume>282</volume>
    <year>1998</year>
    <pub-id pub-id-type="doi">10.1126/science.282.5391.1141</pub-id>
    <pub-id pub-id-type="pmid">9804555</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Baukrowitz</surname>
        <given-names>T</given-names>
      </name>
    </person-group>
    <source>Science</source>
    <article-title>PIP<sub id="sub-1">2</sub> and PIP as determinants ...</article-title>
  </element-citation>
*/
class JournalArticleRef extends BibliographicEntry {}
JournalArticleRef.schema = {
  type: 'journal-article-ref', // publication-type="journal"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  containerTitle: STRING, // <source>: label this 'Journal' or 'Publication' as in Zotero?
  volume: STRING, // <volume>
  issue: STRING, // <issue>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  pmid: STRING // <pub-id pub-id-type="pmid">
}

/*
  <element-citation publication-type="article">
    <year>2016</year>
    <pub-id pub-id-type="doi">10.1101/029983</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Bloss</surname>
        <given-names>CS</given-names>
      </name>
    </person-group>
    <source>bioRxiv</source>
    <article-title>A prospective randomized trial examining...</article-title>
  </element-citation>
*/
class ArticleRef extends BibliographicEntry {}
ArticleRef.schema = {
  type: 'article-ref', // publication-type="article"
  title: STRING, // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  editors: CHILDREN('ref-contrib'), // <person-group person-group-type="editor">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  elocationId: STRING, // <elocation-id>
  doi: STRING, // <pub-id pub-id-type="doi">
  pmid: STRING // <pub-id pub-id-type="pmid">
}

/*
  <element-citation publication-type="magazine">
    <person-group person-group-type="author">
      <name>
        <surname>Craig</surname>
        <given-names>DJ</given-names>
      </name>
    </person-group>
    <year>2017</year>
    <article-title>A voice for women and girls</article-title>
    <source>Columbia Magazine</source>
    <volume>Fall 2017</volume>
    <fpage>36</fpage>
    <lpage>38</lpage>
  </element-citation>
*/
class MagazineArticleRef extends BibliographicEntry {}
MagazineArticleRef.schema = {
  type: 'magazine-article-ref',
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <month>
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="newspaper">
    <day>27</day>
    <edition>International Edition</edition>
    <fpage>21</fpage>
    <month>4</month>
    <part-title>Film</part-title>
    <year>2018</year>
    <person-group person-group-type="author">
      <name>
        <surname>Rose</surname>
        <given-names>Steve</given-names>
      </name>
    </person-group>
    <source>The Guardian</source>
    <article-title>What if superheroes aren’t really the good guys?</article-title>
  </element-citation>
*/
class NewspaperArticleRef extends BibliographicEntry {}
NewspaperArticleRef.schema = {
  type: 'newspaper-article-ref', // publication-type="newspaper"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  volume: STRING, // <volume>
  fpage: STRING, // <fpage>
  lpage: STRING, // <lpage>
  pageRange: STRING, // <page-range>
  doi: STRING, // <pub-id pub-id-type="doi">
  edition: STRING, // <edition>
  partTitle: STRING // <part-title>
}

/*
  <element-citation publication-type="patent">
    <day>17</day>
    <month>03</month>
    <patent country="United States">US20100941530</patent>
    <year>2011</year>
    <person-group person-group-type="inventor">
      <name>
        <surname>Patterson</surname>
        <given-names>JB</given-names>
      </name>
    </person-group>
    <source>United States patent</source>
    <article-title>IRE-1alpha inhibitors</article-title>
  </element-citation>
*/
class PatentRef extends BibliographicEntry {}
PatentRef.schema = {
  type: 'patent-ref', // publication-type="patent"
  inventors: CHILDREN('ref-contrib'), // <person-group person-group-type="inventor">
  assignee: STRING, // <collab collab-type="assignee"><named-content>
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  containerTitle: STRING, // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  patentNumber: STRING, // <patent>US20100941530</patent>
  patentCountry: STRING, // <patent country="United States"></patent>
  doi: STRING // <pub-id pub-id-type="doi">
}

class Permission extends DocumentNode {
  isEmpty () {
    return !(this.copyrightStatement || this.copyrightYear || this.copyrightHolder || this.license || this.licenseText)
  }
}

Permission.schema = {
  type: 'permission',
  copyrightStatement: STRING,
  copyrightYear: STRING,
  copyrightHolder: STRING,
  // URL to license description  used as a unique license identifier
  // FIXME: bad naming. Use url, or licenseUrl?
  license: STRING,
  licenseText: TEXT(...RICH_TEXT_ANNOS)
}

/*
  <element-citation publication-type="report">
    <month>06</month>
    <publisher-loc>Monrovia, Liberia</publisher-loc>
    <publisher-name>NMCP, LISGIS, and ICF International</publisher-name>
    <year>2012</year>
    <person-group person-group-type="author">
      <collab>
        <named-content content-type="name">National Malaria Control Program - Ministry of Health and Social Welfare</named-content>
      </collab>
    </person-group>
    <person-group person-group-type="sponsor">
      <collab>
        <named-content content-type="name">United States Agency for International Development</named-content>
      </collab>
    </person-group>
    <source>Liberia Malaria Indicator Survey 2011</source>
  </element-citation>
*/
class ReportRef extends BibliographicEntry {
  getGuid () {
    return this.isbn
  }
}
ReportRef.schema = {
  type: 'report-ref', // publication-type="report"
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  sponsors: CHILDREN('ref-contrib'), // <person-group person-group-type="sponsor">
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  publisherName: STRING, // <publisher-name>
  publisherLoc: STRING, // <publisher-loc>
  series: STRING, // <series>
  isbn: STRING, // <pub-id pub-id-type="isbn">
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="software">
    <day>19</day>
    <month>3</month>
    <publisher-name>Zenodo</publisher-name>
    <version>2.0.1</version>
    <year>2018</year>
    <pub-id pub-id-type="doi">10.5281/zenodo.1203712</pub-id>
    <person-group person-group-type="author">
      <name>
        <surname>Willner</surname>
        <given-names>Sven</given-names>
      </name>
      <name>
        <surname>Gieseke</surname>
        <given-names>Robert</given-names>
      </name>
    </person-group>
    <source>pyhector</source>
  </element-citation>
*/
class SoftwareRef extends BibliographicEntry {}
SoftwareRef.schema = {
  type: 'software-ref', // publication-type="software"
  title: TEXT(...RICH_TEXT_ANNOS), // <source>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  version: STRING, // <version>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="thesis">
    <publisher-loc>Nijmegen, The Netherlands</publisher-loc>
    <publisher-name>Radboud University Nijmegen Medical Centre</publisher-name>
    <year>2006</year>
    <person-group person-group-type="author">
      <name>
        <surname>Schneider</surname>
        <given-names>P</given-names>
      </name>
    </person-group>
    <article-title>PhD thesis: Submicroscopic <italic id="italic-2">Plasmodium falciparum</italic> gametocytaemia and the contribution to malaria transmission</article-title>
  </element-citation>
*/
class ThesisRef extends BibliographicEntry {}
ThesisRef.schema = {
  type: 'thesis-ref', // publication-type="thesis"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  publisherLoc: STRING, // <publisher-loc>
  publisherName: STRING, // <publisher-name>
  doi: STRING // <pub-id pub-id-type="doi">
}

/*
  <element-citation publication-type="webpage">
    <day>10</day>
    <month>05</month>
    <uri>http://www.michaeleisen.org/blog/?p=1894</uri>
    <date-in-citation iso-8601-date="1995-09-10">1995-09-10</date-in-citation>
    <year>2016</year>
    <person-group person-group-type="author">
      <name>
        <surname>Eisen</surname>
        <given-names>M</given-names>
      </name>
    </person-group>
    <source>it is NOT junk</source>
    <article-title>The Imprinter of All Maladies</article-title>
  </element-citation>
*/
class WebpageRef extends BibliographicEntry {}
WebpageRef.schema = {
  type: 'webpage-ref', // publication-type="webpage"
  title: TEXT(...RICH_TEXT_ANNOS), // <article-title>
  // E.g. website name, where the page appeared
  containerTitle: STRING, // <source>
  authors: CHILDREN('ref-contrib'), // <person-group person-group-type="author">
  year: STRING, // <year>
  month: STRING, // <month>
  day: STRING, // <day>
  accessedDate: STRING, // <date-in-citation iso-8601-date="1995-09-10">
  uri: STRING // <uri>
}

class Person extends DocumentNode {
  getBio () {
    return this.getDocument().get(this.bio)
  }
}

Person.schema = {
  type: 'person',
  surname: STRING,
  givenNames: STRING,
  alias: STRING,
  prefix: STRING,
  suffix: STRING,
  email: STRING,
  orcid: STRING,
  group: ONE('group'),
  affiliations: MANY('organisation'),
  awards: MANY('award'),
  bio: CHILD('bio'),
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
  institution: STRING,
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
  type: 'subject',
  name: STRING,
  category: STRING,
  language: STRING
}

class Preformat extends XMLTextElement {}
Preformat.schema = {
  type: 'preformat',
  content: STRING,
  preformatType: STRING
}

class ContainerTranslation extends XMLContainerNode {}
ContainerTranslation.schema = {
  type: 'container-translation',
  language: STRING
}

class TextTranslation extends XMLTextElement {}
TextTranslation.schema = {
  type: 'text-translation',
  content: TEXT(...RICH_TEXT_ANNOS),
  language: STRING
}

class TableRow extends XMLElementNode {}
TableRow.schema = {
  type: 'table-row',
  _childNodes: CHILDREN('table-cell')
}

class UnsupportedNode extends DocumentNode {}
UnsupportedNode.schema = {
  type: 'unsupported-node',
  data: 'string'
}

class UnsupportedInlineNode extends InlineNode {}
UnsupportedInlineNode.schema = {
  type: 'unsupported-inline-node',
  data: 'string'
}

const InternalArticleSchema = new DocumentSchema({
  name: 'TextureInternalArticle',
  version: '0.1.0',
  DocumentClass: InternalArticleDocument,
  // HACK: still necessary
  // Instead we should find a general way
  defaultTextType: 'p'
})

InternalArticleSchema.addNodes([
  Article,
  ArticleRef,
  Body,
  // metadata
  Metadata,
  ArticleRecord,
  Organisations,
  Authors,
  Awards,
  Groups,
  Editors,
  Keywords,
  Subjects,
  // entities used in metadata
  Award,
  Group,
  Person,
  Organisation,
  Keyword,
  Subject,
  // content
  Abstract,
  Article,
  Back,
  Content,
  DispFormula,
  DispQuote,
  Figure,
  Footnotes,
  Front,
  Heading,
  ListNode,
  ListItemNode,
  Preformat,
  References,
  TableNode,
  TableFigure,
  TableRow,
  TableCellNode,
  Title,
  // bibliography
  BibliographicEntry,
  BookRef,
  ChapterRef,
  ConferencePaperRef,
  DataPublicationRef,
  JournalArticleRef,
  MagazineArticleRef,
  NewspaperArticleRef,
  ReportRef,
  PatentRef,
  Permission,
  SoftwareRef,
  ThesisRef,
  WebpageRef,
  // entity used in bibliography
  RefContrib,
  // translations
  TextTranslation,
  ContainerTranslation,
  // others
  UnsupportedNode,
  UnsupportedInlineNode
])

// Elements taken from the JATS spec
// TODO: make sure that we do not need to modify them, e.g. marking them as inline nodes
InternalArticleSchema.addNodes([
  'bio',
  'caption',
  'fn',
  'graphic',
  'label',
  'p',
  'tex-math',
  'bold',
  'italic',
  'monospace',
  'overline',
  'sc',
  'strike',
  'sub',
  'sup',
  'underline',
  // annos and inline-nodes
  'break',
  'ext-link',
  'inline-formula',
  'inline-graphic',
  'xref'
].map(name => TextureArticleSchema.getNodeClass(name, 'strict')))

export default InternalArticleSchema
