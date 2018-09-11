export default {
  name: 'ArticleNav',
  configure (config) {
    config.addLabel('mode', 'Mode')
    config.addViewMode({
      name: 'open-manuscript',
      viewName: 'manuscript',
      commandGroup: 'switch-view',
      icon: 'fa-align-left',
      label: 'Manuscript'
    })

    config.addViewMode({
      name: 'open-metadata',
      viewName: 'metadata',
      commandGroup: 'switch-view',
      icon: 'fa-th-list',
      label: 'Metadata'
    })

    // TODO: make reader great again
    /*
    config.addViewMode({
      name: 'open-reader',
      viewName: 'reader',
      commandGroup: 'switch-view',
      icon: 'fa-th-list',
      label: 'Reader'
    })
    */
  }
}
