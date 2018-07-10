import BasePackage from '../../shared/BasePackage'
import EditorBasePackage from '../../shared/EditorBasePackage'
import EntityLabelsPackage from '../../entities/EntityLabelsPackage'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    // TODO: register MetaDataEditor related UI stuff here
    // Note, that the model package is already loaded by ArticlePackage
    debugger
    config.import(EntityLabelsPackage)
  }
}
