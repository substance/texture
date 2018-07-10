import BasePackage from '../../shared/BasePackage'
import EditorBasePackage from '../../shared/EditorBasePackage'

export default {
  name: 'ArticleMetaData',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    // TODO: register MetaDataEditor related UI stuff here
    // Note, that the model package is already loaded by ArticlePackage
  }
}
