import FileUploadComponent from './FileUploadComponent'

export default class SupplementaryFileUploadComponent extends FileUploadComponent {
  // NOTE: we are sending uploaded files up to the workflow component
  handleUploadedFiles (files) {
    if (files) {
      this.send('importFile', files)
    }
  }
}
