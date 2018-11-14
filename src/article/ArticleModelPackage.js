import ArticleHTMLConverters from './converter/html/ArticleHTMLConverters'
import EntityLabelsPackage from './shared/EntityLabelsPackage'
import LanguagesPackage from './LanguagesPackage'

import AwardCollectionModel from './models/AwardCollectionModel'
import ArticleRecordModel from './models/ArticleRecordModel'
import DispFormulaModel from './models/DispFormulaModel'
import DispQuoteModel from './models/DispQuoteModel'
import FigureCollectionModel from './models/FigureCollectionModel'
import FigureModel from './models/FigureModel'
import FootnoteCollectionModel from './models/FootnoteCollectionModel'
import GroupCollectionModel from './models/GroupCollectionModel'
import KeywordCollectionModel from './models/KeywordCollectionModel'
import OrganisationCollectionModel from './models/OrganisationCollectionModel'
import PersonCollectionModel from './models/PersonCollectionModel'
import ReferenceCollectionModel from './models/ReferenceCollectionModel'
import SubjectCollectionModel from './models/SubjectCollectionModel'
import TranslateableModel from './models/TranslateableModel'
import TranslationCollectionModel from './models/TranslationCollectionModel'
import TranslationModel from './models/TranslationModel'
import XrefModel from './models/XrefModel'

export default {
  name: 'TextureArticle',
  configure (config) {
    config.import(EntityLabelsPackage)

    // enable rich-text support for clipboard
    ArticleHTMLConverters.forEach(converter => {
      config.addConverter('html', converter)
    })

    // Registry of available languages
    config.import(LanguagesPackage)

    // Collection Models
    config.addModel('authors', PersonCollectionModel)
    config.addModel('awards', AwardCollectionModel)
    config.addModel('editors', PersonCollectionModel)
    config.addModel('figures', FigureCollectionModel)
    config.addModel('footnotes', FootnoteCollectionModel)
    config.addModel('groups', GroupCollectionModel)
    config.addModel('keywords', KeywordCollectionModel)
    config.addModel('organisations', OrganisationCollectionModel)
    config.addModel('references', ReferenceCollectionModel)
    config.addModel('subjects', SubjectCollectionModel)
    config.addModel('translations', TranslationCollectionModel)

    // Other special models
    config.addModel('translatable', TranslateableModel)
    config.addModel('text-translation', TranslationModel)
    config.addModel('container-translation', TranslationModel)
    config.addModel('figure', FigureModel)
    config.addModel('disp-formula', DispFormulaModel)
    config.addModel('disp-quote', DispQuoteModel)
    config.addModel('article-record', ArticleRecordModel)
    config.addModel('table-figure', FigureModel)
    config.addModel('xref', XrefModel)

    // Experimental
    config.setLabelGenerator('references', {
      template: '[$]',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('figures', {
      name: 'Figure',
      plural: 'Figures',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('tables', {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('footnotes', {
      template: '$',
      and: ',',
      to: '-'
    })
  }
}
