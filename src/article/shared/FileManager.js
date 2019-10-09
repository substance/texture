import CitableContentManager from './CitableContentManager'

export default class FileManager extends CitableContentManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, 'file', ['supplementary-file'], labelGenerator)
    this._updateLabels('initial')
  }

  static create (context) {
    const { editorSession, config } = context
    return new FileManager(editorSession, config.getValue('file-label-generator'))
  }

  // ATTENTION: for now we consider only supplementary files that are direct children of the body
  // TODO: we need to specify how this should be extended to supplementary files in figure panels
  getCitables () {
    return this._getContentElement().resolve('content').filter(child => child.type === 'supplementary-file')
  }
}
