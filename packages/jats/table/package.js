import Table from './Table'
import TableComponent from './TableComponent'
import TableConverter from './TableConverter'

export default {
  name: 'table',
  configure: function(config) {
    config.addNode(Table)
    config.addComponent(Table.type, TableComponent)
    config.addConverter('jats', TableConverter)
  }
}
