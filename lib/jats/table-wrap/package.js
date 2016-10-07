import TableWrap from './TableWrap'
import TableWrapConverter from './TableWrapConverter'
import TableWrapComponent from './TableWrapComponent'

export default {
  name: 'table-wrap',
  configure: function(config) {
    config.addNode(TableWrap)
    config.addComponent(TableWrap.type, TableWrapComponent)
    config.addConverter('jats', TableWrapConverter)
  }
}
