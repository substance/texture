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
    return 'sc-insert-figure-panel-tool sc-upload-tool sc-tool'
  }
}

export class ReplaceFigurePanelTool extends FigurePanelTool {
  getClassNames () {
    return 'sc-replace-figure-panel-tool sc-upload-tool sc-tool'
  }
}
