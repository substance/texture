import EntityDatabase from './EntityDatabase'
import {
  BibliographicEntry, JournalArticle, Book, Person, Organisation,
  ConferenceProceeding, ClinicalTrial, Preprint, Report, DataPublication,
  Periodical, Patent, Software, Thesis, Webpage
} from './EntityDatabase'
import EntityLabelsPackage from './EntityLabelsPackage'

export default {
  name: 'entities',
  configure(config) {
    config.defineSchema({
      name: 'entities-database',
      version: '1.0.0',
      DocumentClass: EntityDatabase,
      defaultTextType: 'paragraph'
    })
    config.addNode(BibliographicEntry)
    config.addNode(JournalArticle)
    config.addNode(ConferenceProceeding)
    config.addNode(ClinicalTrial)
    config.addNode(Preprint)
    config.addNode(DataPublication)
    config.addNode(Periodical)
    config.addNode(Patent)
    config.addNode(Software)
    config.addNode(Thesis)
    config.addNode(Webpage)
    config.addNode(Report)
    config.addNode(Book)
    config.addNode(Person)
    config.addNode(Organisation)
    config.import(EntityLabelsPackage)
  }
}
