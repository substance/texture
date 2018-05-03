import EditEntity from './EditEntity'
import CreateEntity from './CreateEntity'
import FormTitle from './FormTitle'
import EntityForm from './EntityForm'

export default {
  name: 'entitiy-components',
  configure(config) {
    config.addComponent('edit-entity', EditEntity)
    config.addComponent('create-entity', CreateEntity)
    config.addComponent('form-title', FormTitle)
    config.addComponent('entity-form', EntityForm)
  }
}
