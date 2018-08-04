import { TextPropertyEditor } from 'substance'
import { BasePackage, EditorBasePackage } from '../../shared'
import EntityLabelsPackage from './EntityLabelsPackage'
import ArticleNavPackage from '../ArticleNavPackage'
import AddEntityCommand from './AddEntityCommand'

import TextureContainerEditor from '../../shared/TextureContainerEditor'
import TextNodeComponent from '../editor/TextNodeComponent'

import ModelEditorPackage from '../../shared/ModelEditorPackage'
import NodeModelEditor from '../../shared/NodeModelEditor'

import CollectionEditor from './CollectionEditor'
import ModelPreviewComponent from '../shared/ModelPreviewComponent'
import TranslateableEditor from './TranslateableEditor'
import FigureComponent from '../shared/FigureComponent'
import GraphicComponent from './GraphicComponent'
import FnComponent from '../editor/FnComponent'

import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import ArticleRecordModel from './ArticleRecordModel'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ArticleNavPackage)
    // TODO: register MetaDataEditor related UI stuff here
    // Note, that the model package is already loaded by ArticlePackage
    config.import(EntityLabelsPackage)

    // built-ins
    config.import(ModelEditorPackage)
    config.addComponent('model-preview', ModelPreviewComponent)

    config.addModel('article-record', ArticleRecordModel)

    // sections and editors
    config.addComponent('collection', CollectionEditor)
    config.addComponent('entity', NodeModelEditor)
    config.addComponent('article-record', NodeModelEditor)
    config.addComponent('person', NodeModelEditor)

    config.addToolPanel('toolbar', [
      {
        name: 'undo-redo',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'undo-redo' }
        ]
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: false,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'formatting' }
        ]
      },
      {
        name: 'Add',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'add-entity' }
        ]
      },
      {
        name: 'mode',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'full',
        items: [
          { type: 'command-group', name: 'switch-view' }
        ]
      },
      // TODO: enable this when we have a first workflow
      // which does not belong to the add-entity group
      // {
      //   name: 'workflows',
      //   type: 'tool-dropdown',
      //   showDisabled: true,
      //   style: 'descriptive',
      //   items: [
      //     { type: 'command-group', name: 'workflows' }
      //   ]
      // }
    ])
    config.addLabel('article-record', {
      en: 'Article'
    })

    config.addLabel('edit', {
      en: 'Edit'
    })
    config.addLabel('workflows', {
      en: 'Workflows'
    })

    config.addCommand('add-author', AddEntityCommand, {
      type: 'author',
      collection: 'authors',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-author', {
      en: 'Add Author'
    })
    config.addCommand('add-editor', AddEntityCommand, {
      type: 'editor',
      collection: 'editors',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-editor', {
      en: 'Add Editor'
    })
    config.addCommand('add-group', AddEntityCommand, {
      type: 'group',
      collection: 'groups',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-group', {
      en: 'Add Group'
    })
    config.addCommand('add-affiliation', AddEntityCommand, {
      type: 'affiliation',
      collection: 'organisations',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-affiliation', {
      en: 'Add Affiliation'
    })
    config.addCommand('add-award', AddEntityCommand, {
      type: 'award',
      collection: 'awards',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-award', {
      en: 'Add Award'
    })
    config.addCommand('add-keyword', AddEntityCommand, {
      type: 'keyword',
      collection: 'keywords',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-keyword', {
      en: 'Add Keyword'
    })
    config.addCommand('add-subject', AddEntityCommand, {
      type: 'subject',
      collection: 'subjects',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-subject', {
      en: 'Add Subject'
    })

    config.addLabel('original-translation', {
      en: 'Original'
    })
    config.addLabel('add-translation', {
      en: 'Add translation'
    })
    config.addLabel('select-language', {
      en: 'Select language'
    })

    config.addLabel('title-trans', {
      en: 'Title'
    })
    config.addLabel('abstract-trans', {
      en: 'Abstract'
    })
    // Components for editors
    config.addComponent('text-node', TextNodeComponent)
    config.addComponent('text-property', TextPropertyEditor)
    config.addComponent('container', TextureContainerEditor)
    // Note: in many cases the general EntityEditor implementation is used
    // In some other cases we use custom ones (e.g. figures)
    config.addComponent('translatable', TranslateableEditor)
    config.addComponent('figure', FigureComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('caption', TextureContainerEditor)
    // LEGACY:
    config.addComponent('footnote', FnComponent)

    // TODO: we should try to extract these into a package and share with ManuscriptEditor
    config.addAnnotationTool({
      name: 'bold',
      nodeType: 'bold',
      commandGroup: 'formatting',
      icon: 'fa-bold',
      label: 'Strong',
      accelerator: 'CommandOrControl+B'
    })

    config.addAnnotationTool({
      name: 'italic',
      nodeType: 'italic',
      commandGroup: 'formatting',
      icon: 'fa-italic',
      label: 'Emphasize',
      accelerator: 'CommandOrControl+I'
    })

    config.addAnnotationTool({
      name: 'sub',
      nodeType: 'sub',
      commandGroup: 'formatting',
      icon: 'fa-subscript',
      label: 'Subscript'
    })

    config.addAnnotationTool({
      name: 'sup',
      nodeType: 'sup',
      commandGroup: 'formatting',
      icon: 'fa-superscript',
      label: 'Superscript'
    })

    config.addAnnotationTool({
      name: 'monospace',
      nodeType: 'monospace',
      commandGroup: 'formatting',
      icon: 'fa-code',
      label: 'Monospace'
    })

    // Section labels
    config.addLabel('authors', 'Authors')
    config.addLabel('figures', 'Figures')
    config.addLabel('footnotes', 'Footnotes')
    config.addLabel('groups', 'Groups')
    config.addLabel('keywords', 'Keywords')
    config.addLabel('subjects', 'Subjects')
    config.addLabel('organisations', 'Organisations')
    config.addLabel('references', 'References')
    config.addLabel('translateables', 'Translations')
    config.addLabel('title-trans', 'Title')
    config.addLabel('abstract-trans', 'Abstract')

    // Workflows
    config.addCommand('add-reference', AddEntityCommand, {
      workflow: 'add-reference',
      commandGroup: 'add-entity'
    })
    config.addLabel('add-reference', {
      en: 'Add Reference'
    })
    config.addComponent('add-reference', AddReferenceWorkflow)

    // Add reference workflow
    config.addLabel('add-reference-title', 'Add Reference(s)')
    config.addLabel('add-ref-manually', 'Or create manually')
    config.addLabel('fetch-datacite', 'Fetch from DataCite')
    config.addLabel('enter-doi-placeholder', 'Enter one or more DOIs')
    config.addLabel('doi-fetch-action', 'Add')
    config.addLabel('import-refs', 'Import')
    config.addLabel('supported-ref-formats', 'Supported formats')
  }
}
