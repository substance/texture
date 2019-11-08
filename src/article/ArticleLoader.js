import { DocumentSchema, DefaultDOMElement, substanceGlobals } from 'substance'
import InternalArticleDocument from './InternalArticleDocument'

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

    let xmlSchemaId = xmlDom.getDoctype().publicId
    // TODO: we need some kind of schema id normalisation, as it seems that
    // in real-world JATS files, nobody is
    if (!xmlSchemaId) {
      throw new Error(`No XML schema specified.`)
    } else if (!articleConfig.isSchemaKnown(xmlSchemaId)) {
      throw new Error(`Unsupported xml schema: ${xmlSchemaId}`)
    }

    // optional input validation if registered
    let validator = articleConfig.getValidator(xmlSchemaId)
    if (validator) {
      let validationResult = validator.validate(xmlDom)
      if (!validationResult.ok) {
        let err = new Error('Validation failed.')
        err.detail = validationResult.errors
        throw err
      }
    }

    // NOTE: there is only one transformation step, i.e. a migration would need
    // to apply other steps implicitly
    let transformation = articleConfig.getTransformation(xmlSchemaId)
    if (transformation) {
      xmlDom = transformation.import(xmlDom)
      // transformation should have updated the schema
      xmlSchemaId = xmlDom.getDoctype().publicId
      // optional another validation step for the new schema
      let validator = articleConfig.getValidator(xmlSchemaId)
      if (validator) {
        let validationResult = validator.validate(xmlDom)
        if (!validationResult.ok)
        {
          // FIXME: For now i've added a temp condig key to disable strict behaviour, but this should be fixed up properly.
          if (substanceGlobals.STRICT_VALIDATION !== undefined && substanceGlobals.STRICT_VALIDATION === false)
          {
            console.warn(`Validation post transformation failed whilst loading the article, carrying on anyway...`)
          }
          else
          {
            let err = new Error('Validation failed.')
            err.detail = validationResult.errors
            throw err
          }
        }
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

    let importer = articleConfig.createImporter(xmlSchemaId, doc)
    if (!importer) {
      console.error(`No importer registered for "${xmlSchemaId}". Falling back to default JATS importer, but with unpredictable result.`)
      // Falling back to default importer
      importer = articleConfig.createImporter('jats', doc)
    }
    importer.import(xmlDom)
    // EXPERIMENTAL: storing the xmlSchemaId on the doc, so that
    // it can be exported using the correct transformers and exporters
    doc.docType = xmlSchemaId

    return doc
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
