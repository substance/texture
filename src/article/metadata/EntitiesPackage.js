import EntityLabelsPackage from './EntityLabelsPackage'

// TODO: remove this
export default {
  name: 'entities',
  configure (config, options = {}) {
    config.import(EntityLabelsPackage)
  }
}
