import {
  BasePackage as SubstanceBasePackage,
  TextPropertyEditor,
  EditInlineNodeCommand,
  AnnotationCommand
} from 'substance'
import { TextureJATSPackage } from 'texture-jats'

import Editor from './components/Editor'
import TextNodeComponent from './components/TextNodeComponent'
import HeadingComponent from './components/HeadingComponent'
import UnsupportedNodeComponent from './components/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './components/UnsupportedInlineNodeComponent'

import EditXrefTool from './components/EditXrefTool'
import AbstractComponent from './components/AbstractComponent'
import ContainerNodeComponent from './components/ContainerNodeComponent'
import ManuscriptComponent from './components/ManuscriptComponent'
import BackComponent from './components/BackComponent'
import BodyComponent from './components/BodyComponent'
import FrontComponent from './components/FrontComponent'
import RefListComponent from './components/RefListComponent'
import RefComponent from './components/RefComponent'
import TitleGroupComponent from './components/TitleGroupComponent'
import XrefComponent from './components/XrefComponent'
import RefPreview from './components/RefPreview'

// TODO: add imports

export default {
  name: 'author',
  configure(config) {
    config.import(SubstanceBasePackage)
    config.import(TextureJATSPackage)

    // Base functionality
    config.addComponent('text-node', TextNodeComponent)
    config.addComponent('text-property-editor', TextPropertyEditor)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    // Article content
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('back', BackComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('front', FrontComponent)
    config.addComponent('ref-list', RefListComponent)
    config.addComponent('ref', RefComponent)
    config.addComponent('title-group', TitleGroupComponent)
    config.addComponent('xref', XrefComponent)

    // Preview components for Ref, Fn, Figure
    config.addComponent('ref-preview', RefPreview)

    // Commands
    config.addCommand('edit-xref', EditInlineNodeCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })

    // Tools
    config.addTool('edit-xref', EditXrefTool)

    // config.addAnnotationTool({
    //   name: 'bold',
    //   commandGroup: 'formatting',
    //   icon: 'fa-lasdf',
    //   label: 'Strong text'
    // })

    // config.addAnnotationTool({
    //   name: 'link',
    //   commandGroup: 'formatting',
    //   icon: 'fa-link',
    //   label: 'Link',
    //   shortcut: 'CMD+B'
    // })

    // // Insert Table
    // config.addInsertTool({
    //   name: 'table',
    //   commandGroup: 'insert',
    //   icon: 'fa-table',
    //   label: 'Table',
    //   shortcut: 'CMD+T'
    // })
    // config.addTextTypeTool({
    //   name: 'heading1',
    //   commandGroup: 'switch-text-type'
    //   icon: 'fa-heading'
    // })

    config.addCommand('bold', AnnotationCommand, {
      nodeType: 'bold',
      commandGroup: 'annotations'
    })
    config.addIcon('bold', { 'fontawesome': 'fa-bold' })
    config.addLabel('bold', 'Bold')


    // Declarative spec for tool display
    config.addToolPanel('toolbar', [
      // {
      //   name: 'text-types',
      //   type: 'tool-dropdown',
      //   showDisabled: true,
      //   style: 'descriptive',
      //   commandGroups: ['text-types']
      // },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['annotations']
      },
      // {
      //   name: 'insert',
      //   type: 'tool-dropdown',
      //   showDisabled: true,
      //   style: 'descriptive',
      //   commandGroups: ['insert']
      // }
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