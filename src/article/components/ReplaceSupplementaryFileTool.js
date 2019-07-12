import UploadTool from './UploadTool'

export default class ReplaceSupplementaryFileTool extends UploadTool {
  getClassNames () {
    return 'sc-replace-supplementary-file-tool sc-upload-tool sc-tool'
  }
  get doesAcceptAllFileTypes () {
    return true
  }

  get canUploadMultiple () {
    return false
  }
}
