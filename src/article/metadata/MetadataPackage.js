import { BasePackage, EditorBasePackage } from '../../shared'
import EntityLabelsPackage from './EntityLabelsPackage'
import AddEntityCommand from './AddEntityCommand'
import WorkflowPane from './WorkflowPane'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    // TODO: register MetaDataEditor related UI stuff here
    // Note, that the model package is already loaded by ArticlePackage
    config.import(EntityLabelsPackage)

    config.addComponent('workflow-pane', WorkflowPane, true)

    config.addToolPanel('toolbar', [
      {
        name: 'edit',
        type: 'tool-group',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'add-entity' }
        ]
      },
      {
        name: 'workflows',
        type: 'tool-group',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'workflows' }
        ]
      }
    ])

    config.addLabel('edit', {
      en: 'Edit'
    })
    config.addLabel('workflows', {
      en: 'Workflows'
    })

    config.addCommand('add-author', AddEntityCommand, {
      type: 'author',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-author', {
      en: 'Add Author',
    })

  }
}
