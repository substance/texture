import AbstractResourceManager from './AbstractResourceManager'

export default class TableManager extends AbstractResourceManager {

  constructor(context) {
    super(context.editorSession,
      'table',
      context.labelGenerator
    )
    this._updateLabels()
  }

}
