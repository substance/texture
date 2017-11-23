import EntityDatabase from './EntityDatabase'
import { JournalArticle, Book, Person, Organisation } from './EntityDatabase'

export default {
  name: 'entities',
  configure(config) {
    config.defineSchema({
      name: 'entities-database',
      version: '1.0.0',
      DocumentClass: EntityDatabase,
      defaultTextType: 'paragraph'
    })
    config.addNode(JournalArticle)
    config.addNode(Book)
    config.addNode(Person)
    config.addNode(Organisation)

    config.addLabel('book', 'Book')
    config.addLabel('journal-article', 'Journal Article')

    // book labels
    config.addLabel('authors', 'Authors')
    config.addLabel('editors', 'Editors')
    config.addLabel('chapterTitle', 'Chapter Title')
    config.addLabel('articleTitle', 'Article Title')
    config.addLabel('source', 'Source')
    config.addLabel('edition', 'Edition')
    config.addLabel('publisherLoc', 'Publisher Location')
    config.addLabel('publisherName', 'Publisher Name')
    config.addLabel('year', 'Year')
    config.addLabel('month', 'Month')
    config.addLabel('day', 'Day')
    config.addLabel('fpage', 'First Page')
    config.addLabel('lpage', 'Last Page')
    config.addLabel('pageRange', 'Page Range')
    config.addLabel('elocationId', 'E-Location ID')
    config.addLabel('doi', 'DOI')
    config.addLabel('isbn', 'ISBN')
    config.addLabel('pmid', 'PubMed ID')
    // person labels
    config.addLabel('orcid', 'ORCID')
    config.addLabel('givenNames', 'Given names')
    config.addLabel('surname', 'Surname')
    config.addLabel('prefix', 'Prefix')
    config.addLabel('suffix', 'Suffix')
    config.addLabel('affiliations', 'Affiliations')
    // organisation labels
    config.addLabel('name', 'Name')

    config.addLabel('edit-book', 'Edit Book')
    config.addLabel('add-book', 'Add Book')
    config.addLabel('edit-journal-article', 'Edit Journal Article')
    config.addLabel('add-journal-article', 'Add Journal Article')
    config.addLabel('add-person', 'Add Person')
    config.addLabel('edit-person', 'Edit Person')
    config.addLabel('add-organisation', 'Add Organisation')
    config.addLabel('edit-organisation', 'Edit Organisation')

    config.addLabel('edit-authors', 'Edit Authors')
    config.addLabel('edit-editors', 'Edit Editors')
    config.addLabel('edit-references', 'Edit Bibliography')
  }
}
