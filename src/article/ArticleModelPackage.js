import ArticleHTMLConverters from './converter/html/ArticleHTMLConverters'
import EntityLabelsPackage from './shared/EntityLabelsPackage'
import LanguagesPackage from './LanguagesPackage'

import AwardCollectionModel from './models/AwardCollectionModel'
import ArticleRecordModel from './models/ArticleRecordModel'
import DispFormulaModel from './models/DispFormulaModel'
import DispQuoteModel from './models/DispQuoteModel'
import FigureCollectionModel from './models/FigureCollectionModel'
import FigureModel from './models/FigureModel'
import FigurePanelModel from './models/FigurePanelModel'
import TableFigureModel from './models/TableFigureModel'
import FootnoteCollectionModel from './models/FootnoteCollectionModel'
import GroupCollectionModel from './models/GroupCollectionModel'
import KeywordCollectionModel from './models/KeywordCollectionModel'
import OrganisationCollectionModel from './models/OrganisationCollectionModel'
import PersonCollectionModel from './models/PersonCollectionModel'
import ReferenceCollectionModel from './models/ReferenceCollectionModel'
import SubjectCollectionModel from './models/SubjectCollectionModel'
import SupplementaryFileModel from './models/SupplementaryFileModel'
import TranslateableModel from './models/TranslateableModel'
import TranslationCollectionModel from './models/TranslationCollectionModel'
import TranslationModel from './models/TranslationModel'
import XrefModel from './models/XrefModel'
import NumberedLabelGenerator from './shared/NumberedLabelGenerator'
import FigureLabelGenerator from './shared/FigureLabelGenerator'

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
    config.addModel('supplementary-file', SupplementaryFileModel)
    config.addModel('translations', TranslationCollectionModel)
    config.addModel('translatable', TranslateableModel)
    config.addModel('text-translation', TranslationModel)
    config.addModel('container-translation', TranslationModel)
    config.addModel('figure', FigureModel)
    config.addModel('figure-panel', FigurePanelModel)
    config.addModel('disp-formula', DispFormulaModel)
    config.addModel('disp-quote', DispQuoteModel)
    config.addModel('article-record', ArticleRecordModel)
    config.addModel('table-figure', TableFigureModel)
    config.addModel('xref', XrefModel)

    // ATTENTION: FigureLabelGenerator works a bit differently
    // TODO: consolidate LabelGenerators and configuration
    // e.g. it does not make sense to say 'setLabelGenerator' but then only provide a configuration for 'NumberedLabelGenerator'
    config.setLabelGenerator('figures', FigureLabelGenerator, {
      singular: 'Figure $',
      plural: 'Figures $',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('footnotes', NumberedLabelGenerator, {
      template: '$',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('formulas', NumberedLabelGenerator, {
      template: '($)',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('references', NumberedLabelGenerator, {
      template: '[$]',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('supplementaries', NumberedLabelGenerator, {
      name: 'Supplementary Files',
      plural: 'Supplementary Files',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('tables', NumberedLabelGenerator, {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    })
  }
}
