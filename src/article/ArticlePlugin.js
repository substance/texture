import ArticlePanel from './ArticlePanel'
import ArticleModelPackage from './models/ArticleModelPackage'
import ArticleLoader from './ArticleLoader'
import ManuscriptEditor from './manuscript/ManuscriptEditor'
import ManuscriptPackage from './manuscript/ManuscriptPackage'
import MetadataEditor from './metadata/MetadataEditor'
import MetadataPackage from './metadata/MetadataPackage'
import FigureLabelGenerator from './shared/FigureLabelGenerator'
import NumberedLabelGenerator from './shared/NumberedLabelGenerator'
import ArticleJATSConverters from './converter/jats/ArticleJATSConverters'
import ArticleJATSImporter from './converter/jats/ArticleJATSImporter'
import ArticleJATSExporter from './converter/jats/ArticleJATSExporter'
import ArticleHTMLConverters from './converter/html/ArticleHTMLConverters'
import ArticleHTMLImporter from './converter/html/ArticleHTMLImporter'
import ArticleHTMLExporter from './converter/html/ArticleHTMLExporter'
import EntityLabelsPackage from './shared/EntityLabelsPackage'

export default {
  name: 'article',
  configure (config) {
    // register ArticlePanel on the Texture configuration level
    config.addComponent('article', ArticlePanel)

    config.registerDocumentLoader('article', ArticleLoader)

    let articleConfig = config.createSubConfiguration('article')

    articleConfig.import(ArticleModelPackage)

    articleConfig.addComponent('manuscript-editor', ManuscriptEditor)
    articleConfig.addComponent('metadata-editor', MetadataEditor)

    articleConfig.import(EntityLabelsPackage)

    ArticleJATSConverters.forEach(converter => {
      articleConfig.addConverter('jats', converter)
    })
    articleConfig.addImporter('jats', ArticleJATSImporter)
    articleConfig.addExporter('jats', ArticleJATSExporter)

    // enable rich-text support for clipboard
    ArticleHTMLConverters.forEach(converter => {
      articleConfig.addConverter('html', converter)
    })
    articleConfig.addImporter('html', ArticleHTMLImporter)
    articleConfig.addExporter('html', ArticleHTMLExporter)

    // ATTENTION: FigureLabelGenerator works a bit differently
    // TODO: consolidate LabelGenerators and configuration
    // e.g. it does not make sense to say 'setLabelGenerator' but then only provide a configuration for 'NumberedLabelGenerator'
    articleConfig.set('figure-label-generator', new FigureLabelGenerator({
      singular: 'Figure $',
      plural: 'Figures $',
      and: ',',
      to: '-'
    }))
    articleConfig.set('footnote-label-generator', new NumberedLabelGenerator({
      template: '$',
      and: ',',
      to: '-'
    }))
    articleConfig.set('formula-label-generator', new NumberedLabelGenerator({
      template: '($)',
      and: ',',
      to: '-'
    }))
    articleConfig.set('reference-label-generator', new NumberedLabelGenerator({
      template: '[$]',
      and: ',',
      to: '-'
    }))
    articleConfig.set('supplementary-file-label-generator', new NumberedLabelGenerator({
      name: 'Supplementary File',
      plural: 'Supplementary Files',
      and: ',',
      to: '-'
    }))
    articleConfig.set('table-label-generator', new NumberedLabelGenerator({
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    }))

    // config for ManuscriptView
    let manuscriptConfig = articleConfig.createSubConfiguration('manuscript')
    manuscriptConfig.import(ManuscriptPackage)

    let metadataConfig = articleConfig.createSubConfiguration('metadata')
    metadataConfig.import(MetadataPackage)
  }
}
