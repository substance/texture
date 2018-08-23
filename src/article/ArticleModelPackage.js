import { ListPackage } from 'substance'
import TextureHTMLConverters from './TextureHTMLConverters'
import XMLListNodeHTMLConverter from './XMLListNodeHTMLConverter'
import EntityLabelsPackage from './shared/EntityLabelsPackage'
import LanguagesPackage from './LanguagesPackage'

import FigureModel from './models/FigureModel'
import ReferenceCollectionModel from './models/ReferenceCollectionModel'
import AuthorCollectionModel from './models/AuthorCollectionModel'
import AwardCollectionModel from './models/AwardCollectionModel'
import EditorCollectionModel from './models/EditorCollectionModel'
import GroupCollectionModel from './models/GroupCollectionModel'
import OrganisationCollectionModel from './models/OrganisationCollectionModel'
import KeywordCollectionModel from './models/KeywordCollectionModel'
import SubjectCollectionModel from './models/SubjectCollectionModel'
import TranslateableCollectionModel from './models/TranslateableCollectionModel'
import TranslateableModel from './models/TranslateableModel'
import TranslationModel from './models/TranslationModel'
import XrefModel from './models/XrefModel'

export default {
  name: 'TextureArticle',
  configure (config) {
    config.import(EntityLabelsPackage)

    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach(converter => {
      config.addConverter('html', converter)
    })
    config.addConverter('html', XMLListNodeHTMLConverter)
    config.addConverter('html', ListPackage.ListItemHTMLConverter)

    // Registry of available languages
    config.import(LanguagesPackage)

    // Collection Models
    config.addModel('authors', AuthorCollectionModel)
    config.addModel('awards', AwardCollectionModel)
    config.addModel('editors', EditorCollectionModel)
    config.addModel('groups', GroupCollectionModel)
    config.addModel('organisations', OrganisationCollectionModel)
    config.addModel('references', ReferenceCollectionModel)
    config.addModel('keywords', KeywordCollectionModel)
    config.addModel('subjects', SubjectCollectionModel)

    // Other special models
    config.addModel('translatables', TranslateableCollectionModel)
    config.addModel('translatable', TranslateableModel)
    config.addModel('text-translation', TranslationModel)
    config.addModel('container-translation', TranslationModel)
    config.addModel('figure', FigureModel)
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
