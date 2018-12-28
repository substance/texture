import UploadTool from '../shared/UploadTool'

class SupplementaryFileTool extends UploadTool {
  acceptAllFileTypes () {
    return true
  }

  uploadMultiple () {
    return false
  }
}

export class InsertSupplementaryFileTool extends SupplementaryFileTool {
  getClassNames () {
    return 'sc-insert-supplementary-file-tool sm-upload-tool'
  }
}

export class ReplaceSupplementaryFileTool extends SupplementaryFileTool {
  getClassNames () {
    return 'sc-replace-supplementary-file-tool sm-upload-tool'
  }
}
