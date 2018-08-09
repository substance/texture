import { forEach } from 'substance'
import JATSImporter from './converter/JATSImporter'
import ArticleConfigurator from './ArticleConfigurator'
import ArticleModelPackage from './ArticleModelPackage'
import ArticleSession from './ArticleSession'

export default {
  load (xml, context) {
    let configurator = new ArticleConfigurator()
    configurator.import(ArticleModelPackage)
    let jatsImporter = new JATSImporter()
    const pubMetaSession = context.pubMetaSession
    const pubMetaDb = pubMetaSession.getDocument()
    // TODO: find a more consistent notion of 'context'
    let jats = jatsImporter.import(xml, { pubMetaDb })
    if (jats.hasErrored) {
      let err = new Error('JATS import failed')
      err.type = 'jats-import-error'
      err.detail = new ImporterErrorReport(jats.errors)
      throw err
    }
    let importer = configurator.createImporter('texture-article')
    let doc = importer.importDocument(jats.dom)
    forEach(pubMetaDb.getNodes(), entity => {
      doc.create(entity)
    })
    let editorSession = new ArticleSession(doc, configurator)
    return editorSession
  }
}

class ImporterErrorReport {
  constructor (jatsImporterErrors) {
    let failedStages = []
    forEach(jatsImporterErrors, (errors, stage) => {
      if (errors && errors.length > 0) {
        failedStages.push({ name: stage, errors })
      }
    })
    this._errors = failedStages
  }

  toString () {
    let frags = this._errors.reduce((frags, stage) => {
      frags.push(`Errors during stage ${stage.name}:`)
      frags = frags.concat(stage.errors.map(err => {
        return _indentMsg(err.msg, '  ') + '\n'
      }))
      return frags
    }, [])
    return frags.join('\n')
  }
}

function _indentMsg (msg, indent) {
  return msg.split('\n').map(line => indent + line).join('\n')
}
