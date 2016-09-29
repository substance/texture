import { InlineWrapperPackage } from 'substance'
import InlineWrapperJATSConverter from './InlineWrapperJATSConverter'

export default {
  name: 'inline-wrapper',
  configure: function(config) {
    config.import(InlineWrapperPackage)
    config.addConverter('jats', InlineWrapperJATSConverter)
  }
}
