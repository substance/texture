import AuthorPackage from '../author/package'
import PublisherPackage from '../publisher/package'

export default {
  name: 'texture',
  configure: function(config, options) {
    if (options.mode === 'publisher') {
      config.import(AuthorPackage)
    } else {
      config.import(PublisherPackage)
    }
  }
};
