import { ToolDropdown } from 'substance'

export default {
  name: 'common',
  configure: function(config) {
    config.addComponent('tool-target-insert', ToolDropdown)
    config.addLabel('insert', 'Insert')
  }
}
