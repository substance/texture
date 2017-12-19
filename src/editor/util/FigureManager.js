import AbstractResourceManager from './AbstractResourceManager'

export default class FigureManager extends AbstractResourceManager {

  constructor(context) {
    super(context.editorSession,
      'fig',
      context.labelGenerator
    )
    this._updateLabels()
  }

  getAvailableResources() {
    // TODO: this should provide a list of available figures
    // from somewhere else
    return super.getAvailableResources()
  }

}
