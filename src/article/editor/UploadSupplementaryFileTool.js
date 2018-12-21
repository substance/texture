import UploadTool from '../shared/UploadTool'

export default class UploadSupplementaryFileTool extends UploadTool {
  getClassNames () {
    return 'sc-upload-supplementary-file-tool sm-upload-tool'
  }

  acceptAllFileTypes () {
    return true
  }

  uploadMultiple () {
    return false
  }
}
