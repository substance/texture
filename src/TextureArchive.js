import { prettyPrintXML } from 'substance'
import PersistedDocumentArchive from './PersistedDocumentArchive'
import ArticleLoader from './ArticleLoader'
import PubMetaLoader from './PubMetaLoader'
import JATSExporter from './converter/JATSExporter'

export default class TextureArchive extends PersistedDocumentArchive {

  _loadDocument(type, record, sessions) {
    switch (type) {
      case 'application/jats4m': {
        // FIXME: we should not mix ingestion and regular loading
        // I.e. importing JATS4M should work without a pub-meta
        let pubMetaSession = PubMetaLoader.load()
        // HACK: we need to think about how to generalize this
        sessions['pub-meta'] = pubMetaSession
        // let dom = substance.DefaultDOMElement.parseXML(record.data)
        // console.log(prettyPrintXML(dom))
        // debugger
        return ArticleLoader.load(record.data, {
          pubMetaDb: pubMetaSession.getDocument()
        })
      }
      default:
        throw new Error('Unsupported document type')
    }
  }

  _exportDocument(type, session, sessions) {
    switch (type) {
      case 'application/jats4m': {
        // FIXME: hard-coded, and thus bad
        // TODO: export only those resources which have been changed
        // Also we need to
        let jatsExporter = new JATSExporter()
        let pubMetaDb = sessions['pub-meta'].getDocument()
        let doc = session.getDocument()
        let dom = doc.toXML()
        let res = jatsExporter.export(dom, { pubMetaDb, doc })
        console.info('saving jats', res.dom.getNativeElement())
        let xmlStr = prettyPrintXML(res.dom)
        return xmlStr
      }
      default:
        throw new Error('Unsupported document type')
    }
  }

}