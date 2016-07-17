import SubstanceInlineWrapperPackage from 'substance/packages/inline-wrapper/InlineWrapperPackage'
import InlineWrapperJATSConverter from './InlineWrapperJATSConverter'

export default {
  name: 'inline-wrapper',

  configure: function(config) {
    config.import(SubstanceInlineWrapperPackage)
    config.addConverter('jats', InlineWrapperJATSConverter)
  }
}
