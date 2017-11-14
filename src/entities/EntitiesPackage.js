import EntityDatabase from './EntityDatabase'
import { JournalCitation, BookCitation, Person } from './EntityDatabase'

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
  }
}
