import AbstractResourceManager from './AbstractResourceManager'

export default class TableManager extends AbstractResourceManager {

  constructor(context) {
    super(context.editorSession,
      'table',
      context.configurator.getLabelGenerator('tables')
    )

    this._updateLabels()
  }

}
