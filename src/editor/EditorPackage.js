import { BasePackage as SubstanceBasePackage, TextPropertyEditor } from 'substance'
import Editor from './components/Editor'

// TODO: add imports


export default {
  name: 'author',
  configure(config) {
    config.import(ArticlePackage)
    config.import(SubstanceBasePackage)

    // Base functionality
    config.addComponent('text', TextNodeComponent)
    config.addComponent('text-property-editor', TextPropertyEditor)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    // Article content
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('article', ArticleComponent)
    config.addComponent('back', SimpleBackComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('front', SimpleFrontComponent)
    config.addComponent('ref-list', RefListComponent)
    config.addComponent('ref', RefComponent)
    config.addComponent('title-group', TitleGroupComponent)
    config.addComponent('xref', XrefComponent)

    // Commands
    config.addCommand('edit-xref', EditInlineNodeCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })

    // Tools
    config.addTool('edit-xref', EditXrefTool)

    // Declarative spec for tool display
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

    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'tool-group',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['prompt']
      }
    ])
  },
  Editor
}