import EntityDatabase from './EntityDatabase'
import { JournalCitation, BookCitation, Person, Organisation } from './EntityDatabase'

export default {
  name: 'entities',
  configure(config) {
    config.defineSchema({
      name: 'entities-database',
      version: '1.0.0',
      DocumentClass: EntityDatabase,
      defaultTextType: 'paragraph'
    })
    config.addNode(JournalCitation)
    config.addNode(BookCitation)
    config.addNode(Person)
    config.addNode(Organisation)

    // book-citation labels
    config.addLabel('authors', 'Authors')
    config.addLabel('editors', 'Editors')
    config.addLabel('chapterTitle', 'Chapter Title')
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
    // person labels
    config.addLabel('orcid', 'ORCID')
    config.addLabel('givenNames', 'Given names')
    config.addLabel('surname', 'Surname')
    config.addLabel('prefix', 'Prefix')
    config.addLabel('suffix', 'Suffix')
    config.addLabel('affiliations', 'Affiliations')
    // organisation labels
    config.addLabel('name', 'Name')


    config.addLabel('edit-book-citation', 'Edit Book')
    config.addLabel('add-book-citation', 'Add Book')
    config.addLabel('edit-journal-citation', 'Edit Journal Publication')
    config.addLabel('add-journal-citation', 'Add Journal Publication')
    config.addLabel('add-person', 'Add Person')
    config.addLabel('edit-person', 'Edit Person')
    config.addLabel('add-organisation', 'Add Organisation')
    config.addLabel('edit-organisation', 'Edit Organisation')

    config.addLabel('edit-authors', 'Edit Authors')
    config.addLabel('edit-editors', 'Edit Editors')
  }
}
