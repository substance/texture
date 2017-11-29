import AbstractResourceManager from './AbstractResourceManager'

export default class FigureManager extends AbstractResourceManager {

  constructor(context) {
    super(context.editorSession,
      'fig',
      context.configurator.getLabelGenerator('figures')
    )

    this._updateLabels()
  }

  getAvailableResources() {
    // TODO: this should provide a list of available figures
    // from somewhere else
    return super.getAvailableResources()
  }

}
