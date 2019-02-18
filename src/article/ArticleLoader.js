import { forEach } from 'substance'
import ArticleConfigurator from './ArticleConfigurator'
import ArticleModelPackage from './ArticleModelPackage'
import ArticleSession from './ArticleSession'
import JATSImporter from './converter/JATSImporter'

export default {
  load (xml) {
    let configurator = new ArticleConfigurator()
    configurator.import(ArticleModelPackage)
    let jatsImporter = new JATSImporter()
    let importOptions = {
      allowNotImplemented: true
    }
    let result = jatsImporter.import(xml, importOptions)
    if (result.hasErrored) {
      let err = new Error('JATS import failed')
      err.type = 'jats-import-error'
      err.detail = new ImporterErrorReport(result.errors)
      throw err
    }
    let doc = result.doc
    return new ArticleSession(doc, configurator)
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
