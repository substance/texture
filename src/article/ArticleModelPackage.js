import { ListPackage } from 'substance'
import TextureHTMLConverters from './TextureHTMLConverters'
import XMLListNodeHTMLConverter from './XMLListNodeHTMLConverter'
import EntitiesPackage from './metadata/EntitiesPackage'

// TODO: most of these need to be rewritten
import FigureModel from './models/FigureModel'
import FigureCollectionModel from './models/FigureCollectionModel'
import FootnoteModel from './models/FootnoteModel'
import FootnoteCollectionModel from './models/FootnoteCollectionModel'
import ReferenceCollectionModel from './models/ReferenceCollectionModel'
import AuthorCollectionModel from './models/AuthorCollectionModel'
import AwardCollectionModel from './models/AwardCollectionModel'
import EditorCollectionModel from './models/EditorCollectionModel'
import GroupCollectionModel from './models/GroupCollectionModel'
import OrganisationCollectionModel from './models/OrganisationCollectionModel'
import KeywordCollectionModel from './models/KeywordCollectionModel'
import SubjectCollectionModel from './models/SubjectCollectionModel'

import LanguagesPackage from './LanguagesPackage'

// Custom models
import TranslateableCollectionModel from './models/TranslateableCollectionModel'
import TranslateableModel from './models/TranslateableModel'
import TranslationModel from './models/TranslationModel'
import XrefModel from './models/XrefModel'

export default {
  name: 'TextureArticle',
  configure (config) {
    // EXPERIMENTAL: extend the InternalArticle schema with entities
    // we want to merge PubMetaDb into the InternalArticle
    config.import(EntitiesPackage)

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
    config.addModel('figures', FigureCollectionModel)
    config.addModel('footnotes', FootnoteCollectionModel)

    // Other special models
    config.addModel('translatables', TranslateableCollectionModel)
    config.addModel('translatable', TranslateableModel)
    config.addModel('translation', TranslationModel)

    config.addModel('xref', XrefModel)

    // Models: Provide API's on top of raw nodes
    config.addModel('fig', FigureModel)
    config.addModel('fn', FootnoteModel)
    config.addModel('table-wrap', FigureModel)

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
