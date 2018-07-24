import { registerSchema, ListPackage } from 'substance'
import TextureDocument from './TextureDocument'
import InternalArticle from './InternalArticle'
import TextureArticleImporter from './TextureArticleImporter'
import TextureHTMLConverters from './TextureHTMLConverters'
import XMLListNode from './XMLListNode'
import XMLListItemNode from './XMLListItemNode'
import XMLListNodeHTMLConverter from './XMLListNodeHTMLConverter'
import TableElementNode from './TableElementNode'
import TableCellElementNode from './TableCellElementNode'

import ArticleRecordModel from './models/ArticleRecordModel'
import FigureModel from './models/FigureModel'
import FigureCollectionModel from './models/FigureCollectionModel'
import FootnoteModel from './models/FootnoteModel'
import FootnoteCollectionModel from './models/FootnoteCollectionModel'
import ReferenceModel from './models/ReferenceModel'
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

import RefContribPropertyEditor from './metadata/RefContribPropertyEditor'
import StringPropertyEditor from './metadata/StringPropertyEditor'
import BooleanPropertyEditor from './metadata/BooleanPropertyEditor'
import ReferencePropertyEditor from './metadata/ReferencePropertyEditor'
import UniqueReferencePropertyEditor from './metadata/UniqueReferencePropertyEditor'

export default {
  name: 'TextureArticle',
  configure (config) {
    registerSchema(config, InternalArticle, TextureDocument)

    // override registered nodes
    config.addNode(XMLListNode, true)
    config.addNode(XMLListItemNode, true)
    config.addNode(TableElementNode, true)
    config.addNode(TableCellElementNode, true)

    config.addImporter(InternalArticle.getName(), TextureArticleImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach(converter => {
      config.addConverter('html', converter)
    })
    config.addConverter('html', XMLListNodeHTMLConverter)
    config.addConverter('html', ListPackage.ListItemHTMLConverter)

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

    // Models: Provide API's on top of raw nodes
    config.addModel('fig', FigureModel)
    config.addModel('fn', FootnoteModel)
    config.addModel('table-wrap', FigureModel)
    config.addModel('article-record', ArticleRecordModel)
    config.addModel('journal-article', ReferenceModel)
    config.addModel('conference-paper', ReferenceModel)
    config.addModel('data-publication', ReferenceModel)
    config.addModel('magazine-article', ReferenceModel)
    config.addModel('newspaper-article', ReferenceModel)
    config.addModel('patent', ReferenceModel)
    config.addModel('software', ReferenceModel)
    config.addModel('thesis', ReferenceModel)
    config.addModel('webpage', ReferenceModel)
    config.addModel('report', ReferenceModel)
    config.addModel('book', ReferenceModel)
    config.addModel('chapter', ReferenceModel)

    config.addPropertyEditor(RefContribPropertyEditor)
    config.addPropertyEditor(BooleanPropertyEditor)
    config.addPropertyEditor(StringPropertyEditor)
    config.addPropertyEditor(ReferencePropertyEditor)
    config.addPropertyEditor(UniqueReferencePropertyEditor)

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
