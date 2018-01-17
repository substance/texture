import { Component } from 'substance'
import EditorPackage from './editor/EditorPackage'
import JATSExporter from './converter/JATSExporter'

export default class Texture extends Component {

  constructor(...args) {
    super(...args)

    const archive = this.props.archive
    this.manuscriptSession = archive.getEditorSession('manuscript')
    this.pubMetaDbSession = archive.getEditorSession('pub-meta')
    this.configurator = this.manuscriptSession.getConfigurator()
  }

  getChildContext() {
    const configurator = this.configurator
    const pubMetaDbSession = this.pubMetaDbSession
    const pubMetaDb = pubMetaDbSession.getDocument()
    const doc = this.manuscriptSession.getDocument()
    return {
      configurator,
      pubMetaDbSession,
      exporter: {
        export(dom) {
          let jatsExporter = new JATSExporter()
          return jatsExporter.export(dom, { pubMetaDb, doc })
        }
      },
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-texture')
    el.append(
      $$(EditorPackage.Editor, {
        editorSession: this.manuscriptSession,
        pubMetaDbSession: this.pubMetaDbSession
      })
    )
    return el
  }

  getConfigurator() {
    return this.configurator
  }

}
