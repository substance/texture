import Author from './Author'
import ArticlePackage from '../article/ArticlePackage'

export default {
  name: 'author',
  configure(config) {
    config.import(ArticlePackage)

    // Configure toolbar
    config.addToolPanel('toolbar', [
      {
        name: 'text-types',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        commandGroups: ['text-types']
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['annotations']
      },
      {
        name: 'insert',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        commandGroups: ['insert']
      }
    ])
  },
  Author
}