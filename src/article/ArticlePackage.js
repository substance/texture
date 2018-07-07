import { ToggleTool, BasePackage as SubstanceBasePackage } from 'substance'
import ModelPackage from './TextureArticlePackage'
import EditorPackage from '../editor/EditorPackage'
import MetaDataPackage from './meta-data/MetaDataPackage'
import PreviewPackage from '../reader/ReaderPackage'
import ArticlePanel from './ArticlePanel'
import ArticleConfigurator from './ArticleConfigurator'
import ManuscriptEditor from '../editor/components/ManuscriptEditor'
import MetaDataEditor from './meta-data/MetaDataEditor'
import SwitchViewCommand from './SwitchViewCommand'

export default {
  name: 'Article',
  configure (parentConfig) {
    parentConfig.addComponent('article', ArticlePanel)
    // create a configuration scope
    let config = parentConfig.createScope('article')

    // used during import
    let modelConfig = new ArticleConfigurator().import(ModelPackage)
    config.setConfiguration('model', modelConfig)
    // used for the manuscript editor view
    let manuscriptEditorConfig = ArticleConfigurator.createFrom(modelConfig).import(EditorPackage)
    config.setConfiguration('manuscript', manuscriptEditorConfig)
    // used for the meta-data editor view
    let metaDataEditorConfig = ArticleConfigurator.createFrom(modelConfig).import(MetaDataPackage)
    config.setConfiguration('meta-data', metaDataEditorConfig)
    // used for preview
    let previewConfig = ArticleConfigurator.createFrom(modelConfig).import(PreviewPackage)
    config.setConfiguration('preview', previewConfig)

    config.import(SubstanceBasePackage)
    // UI stuff for the ArticlePanel
    config.addComponent('manuscript-editor', ManuscriptEditor)
    config.addComponent('meta-data-editor', MetaDataEditor)

    config.addToolPanel('nav-bar', [
      {
        name: 'view',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['switch-view']
      }
    ])

    config.addCommand('open-manuscript', SwitchViewCommand, {
      view: 'manuscript',
      commandGroup: 'switch-view'
    })
    config.addCommand('open-meta-data', SwitchViewCommand, {
      view: 'meta-data',
      commandGroup: 'switch-view'
    })

    config.addTool('open-manuscript', ToggleTool)
    config.addLabel('open-manuscript', 'Open Manuscript')
    config.addIcon('open-manuscript', { 'fontawesome': 'fa-align-left' })

    config.addTool('open-meta-data', ToggleTool)
    config.addLabel('open-meta-data', 'Open Meta-Data')
    config.addIcon('open-meta-data', { 'fontawesome': 'fa-th-list' })
  }
}
