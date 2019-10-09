import { validateXML } from 'texture-xml-utils'
import ArticleConfigurator from './ArticleConfigurator'
import ArticleLoader from './ArticleLoader'
import ArticleModelPackage from './nodes/ArticleModelPackage'
import ArticlePanel from './ArticlePanel'
import ArticleSerializer from './ArticleSerializer'
import {
  TEXTURE_JATS_PUBLIC_ID, JATS_GREEN_1_1_PUBLIC_ID, JATS_GREEN_1_2_PUBLIC_ID
} from './ArticleConstants'
import TextureJATS from './TextureJATS'
import ManuscriptPackage from './shared/ManuscriptPackage'
import EntityLabelsPackage from './shared/EntityLabelsPackage'
import MetadataPackage from './metadata/MetadataPackage'
import FigureLabelGenerator from './shared/FigureLabelGenerator'
import NumberedLabelGenerator from './shared/NumberedLabelGenerator'
import ArticleHTMLConverters from './converter/html/ArticleHTMLConverters'
import ArticleHTMLExporter from './converter/html/ArticleHTMLExporter'
import ArticleHTMLImporter from './converter/html/ArticleHTMLImporter'
import ArticleJATSConverters from './converter/jats/ArticleJATSConverters'
import ArticleJATSExporter from './converter/jats/ArticleJATSExporter'
import ArticleJATSImporter from './converter/jats/ArticleJATSImporter'
import JATSTransformer from './converter/transform/jats/JATSTransformer'
import DefaultArticleEditor from './components/DefaultArticleEditor'
import FigureManager from './shared/FigureManager'
import FootnoteManager from './shared/FootnoteManager'
import ReferenceManager from './shared/ReferenceManager'
import EquationManager from './shared/EquationManager'
import FileManager from './shared/FileManager'
import TableManager from './shared/TableManager'

export default {
  name: 'article',
  configure (config) {
    // register ArticlePanel on the Texture configuration level
    config.addComponent('article', ArticlePanel)

    config.registerDocumentLoader('article', ArticleLoader)
    config.registerDocumentSerializer('article', ArticleSerializer)

    let articleConfig = config.createSubConfiguration('article', { ConfiguratorClass: ArticleConfigurator })

    // used for validation
    articleConfig.import(ArticleModelPackage)

    articleConfig.import(EntityLabelsPackage)

    articleConfig.registerSchemaId(JATS_GREEN_1_1_PUBLIC_ID)
    articleConfig.registerSchemaId(JATS_GREEN_1_2_PUBLIC_ID)

    ArticleJATSConverters.forEach(converter => {
      articleConfig.addConverter('jats', converter)
    })
    // register default 'jats' im-/exporter
    articleConfig.addImporter('jats', ArticleJATSImporter)
    articleConfig.addExporter('jats', ArticleJATSExporter)

    // register im-/exporter for TextureJATS
    articleConfig.addImporter(TEXTURE_JATS_PUBLIC_ID, ArticleJATSImporter, {
      converterGroups: ['jats']
    })
    articleConfig.addExporter(TEXTURE_JATS_PUBLIC_ID, ArticleJATSExporter, {
      converterGroups: ['jats']
    })
    let transformation = new JATSTransformer()
    // register transformations for all supported JATS versions
    // NOTE: ATM  there is only one transformation because we do not use all JATS features
    // as TextureJATS is a very strict subset of JATS
    articleConfig.addTransformation('jats', transformation)
    articleConfig.addTransformation(JATS_GREEN_1_1_PUBLIC_ID, transformation)
    articleConfig.addTransformation(JATS_GREEN_1_2_PUBLIC_ID, transformation)

    let validator = {
      schemaId: TextureJATS.publicId,
      validate (xmlDom) {
        return validateXML(TextureJATS, xmlDom)
      }
    }
    articleConfig.addValidator(TextureJATS.publicId, validator)

    // enable rich-text support for clipboard
    ArticleHTMLConverters.forEach(converter => {
      articleConfig.addConverter('html', converter)
    })
    articleConfig.addImporter('html', ArticleHTMLImporter)
    articleConfig.addExporter('html', ArticleHTMLExporter)

    // ATTENTION: FigureLabelGenerator works a bit differently
    // TODO: consolidate LabelGenerators and configuration
    // e.g. it does not make sense to say 'setLabelGenerator' but then only provide a configuration for 'NumberedLabelGenerator'
    articleConfig.setValue('figure-label-generator', new FigureLabelGenerator({
      singular: 'Figure $',
      plural: 'Figures $',
      and: ',',
      to: '-'
    }))
    articleConfig.setValue('footnote-label-generator', new NumberedLabelGenerator({
      template: '$',
      and: ',',
      to: '-'
    }))
    articleConfig.setValue('equation-label-generator', new NumberedLabelGenerator({
      template: '($)',
      and: ',',
      to: '-'
    }))
    articleConfig.setValue('reference-label-generator', new NumberedLabelGenerator({
      template: '[$]',
      and: ',',
      to: '-'
    }))
    articleConfig.setValue('file-label-generator', new NumberedLabelGenerator({
      name: 'Supplementary File',
      plural: 'Supplementary Files',
      and: ',',
      to: '-'
    }))
    articleConfig.setValue('table-label-generator', new NumberedLabelGenerator({
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    }))

    // The default article-editor is a DefaultArticleEditor
    // TODO: document how a plugin can override this, for a specific article type
    articleConfig.addComponent('article-editor', DefaultArticleEditor)
    articleConfig.import(ManuscriptPackage)

    articleConfig.addService('figure-manager', FigureManager.create)
    articleConfig.addService('footnote-manager', FootnoteManager.create)
    articleConfig.addService('equation-manager', EquationManager.create)
    articleConfig.addService('reference-manager', ReferenceManager.create)
    articleConfig.addService('file-manager', FileManager.create)
    articleConfig.addService('table-manager', TableManager.create)

    articleConfig.import(MetadataPackage)
  }
}
