import UploadTool from '../shared/UploadTool'

class SupplementaryFileTool extends UploadTool {
  get doesAcceptAllFileTypes () {
    return true
  }

  get canUploadMultiple () {
    return false
  }
}

export class ReplaceSupplementaryFileTool extends SupplementaryFileTool {
  getClassNames () {
    return 'sc-replace-supplementary-file-tool sc-upload-tool sc-tool'
  }
}
