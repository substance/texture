import EditMetadataWorkflow from './EditMetadataWorkflow'
import ArticleInformationSectionComponent from './ArticleInformationSectionComponent'
import ArticleMetadataComponent from './ArticleMetadataComponent'
import AbstractsSectionComponent from './AbstractsSectionComponent'
import FiguresSectionComponent from './FiguresSectionComponent'

export default {
  name: 'metadata',
  configure (articleConfig) {
    articleConfig.addComponent('edit-metadata', EditMetadataWorkflow)
    let config = articleConfig.createSubConfiguration('metadata')

    config.addToolPanel('toolbar', [
      {
        name: 'document-tools',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'undo' },
          { type: 'command', name: 'redo' }
        ]
      },
      {
        name: 'primary-annotations',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'toggle-bold', label: 'bold', icon: 'bold' },
          { type: 'command', name: 'toggle-italic', label: 'italic', icon: 'italic' },
          { type: 'command', name: 'create-external-link', label: 'link', icon: 'link' }
        ]
      }
    ])
    config.addToolPanel('context-menu', [
      {
        name: 'context-menu',
        type: 'group',
        style: 'descriptive',
        hideDisabled: true,
        items: [
          { type: 'command-group', name: 'author' },
          { type: 'command-group', name: 'collection' }
        ]
      }
    ])
    config.addComponent('article-metadata', ArticleMetadataComponent)
    config.addComponent('article-information', ArticleInformationSectionComponent)
    config.addComponent('@abstracts', AbstractsSectionComponent)
    config.addComponent('@figures', FiguresSectionComponent)

    config.addLabel('abstracts', 'Abstracts')
    config.addLabel('article-information', 'Article Information')
    config.addLabel('article-metadata', 'Article Metadata')
    config.addLabel('groups', 'Groups')
    config.addLabel('issueTitle', 'Issue Title')
    config.addLabel('keywords', 'Keywords')
    config.addLabel('subjects', 'Subjects')
    config.addLabel('organisations', 'Affiliations')
  }
}
