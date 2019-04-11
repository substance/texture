import { DocumentSchema, DefaultDOMElement } from 'substance'
import ArticleSession from './ArticleSession'
import InternalArticleDocument from './InternalArticleDocument'
import JATSTransformer from './converter/transform/JATSTransformer'
import validateXML from './converter/util/validateXML'
import JATS from './JATS'
import TextureJATS from './TextureJATS'

export default class ArticleLoader {
  /**
   * The ArticleLoader by default takes a JATS file and importing it into
   * Texture's internal article model. On the way to there, the source file
   * is first validated against the declared schema. Then a set of transformations
   * is applied open to some known tagging habbits deviating from the tagging style
   * adopted by Texture. Before applying the actual mapping into the internal
   * article model, the content is validated against the TextureJATS schema,
   * being a subset of JATS, as an indicator for problems such as loss of information.
   */
  load (xml, config) {
    let articleConfig = config.getConfiguration('article')

    let xmlDom = DefaultDOMElement.parseXML(xml)

    // TODO: detect the actual schema version
    let publicId = xmlDom.getDoctype().publicId
    // TODO: this needs to be thought through better
    let jatsSchema = articleConfig.getJATSVariant(publicId)
    // use the default JATS schema in case that this variant is not registered
    if (!jatsSchema) {
      jatsSchema = JATS
    }

    if (!jatsSchema) throw new Error(`Unsupported JATS variant: ${publicId}`)

    // Note: the first check is used to detect violations of the declared
    // schema of the XML input. This is a strict check, which stops the import.
    // TODO: create error report
    let validationResult = validateXML(jatsSchema, xmlDom)
    if (!validationResult.ok) {
      throw new Error('Validation failed.')
    }

    // Note: after the initial validation
    // TODO: allow to configure this transformation layer
    // For now transformers are run only for regular JATS files every imported jats,
    // but on the long run we should only run transformers for a specific schema
    if (jatsSchema.publicId === JATS.publicId) {
      let transformer = new JATSTransformer()
      xmlDom = transformer.import(xmlDom)
    }

    // TODO: how would we make sure that a custom JATS would conform to TextureJATS?
    // ... idea: we could validate only elements that are goverened by TextureJATS
    if (jatsSchema === JATS) {
      let validationResult = validateXML(TextureJATS, xmlDom, {
        // being less strict, with the side-effect that there is no error-report
        // for unsupported content, only for violating content
        // TODO: we should in this case treat those errors as warnings, show
        // a warnings dialog, allowing to continue
        allowNotImplemented: true
      })
      // TODO: create report
      if (!validationResult.ok) {
        throw new Error('Validation failed.')
      }
    }

    // TODO: we should only use nodes that are registered for the specifc schema
    let schema = new DocumentSchema({
      DocumentClass: InternalArticleDocument,
      nodes: articleConfig.getNodes(),
      // TODO: try to get rid of this by using property schema
      defaultTextType: 'paragraph'
    })
    let doc = InternalArticleDocument.createEmptyArticle(schema)

    let importer = articleConfig.createImporter(publicId, doc)
    if (!importer) {
      console.error(`No importer registered for jats type "${publicId}". Falling back to default JATS importer`)
      // Falling back to default importer
      importer = articleConfig.createImporter('jats', doc)
    }
    importer.import(xmlDom)

    return new ArticleSession(doc, articleConfig)
  }
}

// class ImporterErrorReport {
//   constructor (jatsImporterErrors) {
//     let failedStages = []
//     forEach(jatsImporterErrors, (errors, stage) => {
//       if (errors && errors.length > 0) {
//         failedStages.push({ name: stage, errors })
//       }
//     })
//     this._errors = failedStages
//   }

//   toString () {
//     let frags = this._errors.reduce((frags, stage) => {
//       frags.push(`Errors during stage ${stage.name}:`)
//       frags = frags.concat(stage.errors.map(err => {
//         return _indentMsg(err.msg, '  ') + '\n'
//       }))
//       return frags
//     }, [])
//     return frags.join('\n')
//   }
// }

// function _indentMsg (msg, indent) {
//   return msg.split('\n').map(line => indent + line).join('\n')
// }
