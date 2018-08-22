/* eslint-disable no-template-curly-in-string */
import { BasePackage, ModelComponentPackage } from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'
import ReferenceListComponent from '../shared/ReferenceListComponent'

export default {
  name: 'ArticleReader',
  configure (config) {
    config.import(BasePackage)
    config.import(ModelComponentPackage)
    config.import(ManuscriptContentPackage)
    config.import(EntityLabelsPackage)
    config.import(ArticleNavPackage)

    config.addComponent('references', ReferenceListComponent)

    config.addToolPanel('toolbar', [
      {
        name: 'mode',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'full',
        items: [
          { type: 'command-group', name: 'switch-view' }
        ]
      }
    ])
  }
}
