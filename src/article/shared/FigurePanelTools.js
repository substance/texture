import UploadTool from './UploadTool'

class FigurePanelTool extends UploadTool {
  getFileType () {
    return 'image/*'
  }

  get canUploadMultiple () {
    return false
  }
}

export class InsertFigurePanelTool extends FigurePanelTool {
  getClassNames () {
    return 'sc-insert-figure-panel-tool sm-upload-tool'
  }
}

export class ReplaceFigurePanelTool extends FigurePanelTool {
  getClassNames () {
    return 'sc-replace-figure-panel-tool sm-upload-tool'
  }
}
