import { DocumentSchema, DefaultDOMElement } from 'substance'
import ArticleSession from './ArticleSession'
import InternalArticleDocument from './InternalArticleDocument'

export default class ArticleLoader {
  load (xml, config) {
    let articleConfig = config.getConfiguration('article')

    let xmlDom = DefaultDOMElement.parseXML(xml)

    // TODO: allow for a translation layer here, where certain known common transformation are applied.
    // FIXME: bring back transformations

    // TODO: allow to control via options if validation should be done or not
    // or if the importer should be resilient against violations (e.g. by wrapping unsupported elements)

    // TODO: we should only use nodes that are registered for the specifc article type
    // e.g. only nodes of a specific JATS customisation if the article
    let schema = new DocumentSchema({
      DocumentClass: InternalArticleDocument,
      nodes: articleConfig.getNodes(),
      // TODO: try to get rid of this by using property schema
      defaultTextType: 'paragraph'
    })
    let doc = InternalArticleDocument.createEmptyArticle(schema)

    // TODO: support JATS customisations registered via a plugin (e.g. stencila)
    // the plugin would register a 'sniffer' used by a loader factory
    // per default we would use our regular JATS importer

    let importer = articleConfig.createImporter('jats', doc)
    importer.import(xmlDom, {
      // being less strict, with the side-effect that there is no error-report
      // for unsupported content, only for violating content
      // TODO: we should in this case treat those errors as warnings, show
      // a warnings dialog, allowing to continue
      allowNotImplemented: true
    })

    // TODO: bring back validation and error reporting

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
