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

    // Annotation tools
    config.addAnnotationTool({
      name: 'bold',
      nodeType: 'bold',
      commandGroup: 'formatting',
      icon: 'fa-bold',
      label: 'Strong',
      accelerator: 'cmd+b'
    })

    config.addAnnotationTool({
      name: 'italic',
      nodeType: 'italic',
      commandGroup: 'formatting',
      icon: 'fa-italic',
      label: 'Emphasize',
      accelerator: 'cmd+i'
    })

    config.addAnnotationTool({
      name: 'ext-link',
      nodeType: 'ext-link',
      commandGroup: 'formatting',
      icon: 'fa-link',
      label: 'Link',
      accelerator: 'cmd+k'
    })

    config.addTextTypeTool({
      name: 'heading1',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '1' }
      },
      icon: 'fa-header',
      label: 'Heading 1',
      accelerator: 'cmd+alt+1'
    })

    config.addTextTypeTool({
      name: 'heading2',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '2' }
      },
      icon: 'fa-header',
      label: 'Heading 2',
      accelerator: 'cmd+alt+2'
    })

    config.addTextTypeTool({
      name: 'heading3',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '3' }
      },
      icon: 'fa-header',
      label: 'Heading 3',
      accelerator: 'cmd+alt+3'
    })

    config.addTextTypeTool({
      name: 'paragraph',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'p'
      },
      icon: 'fa-paragraph',
      label: 'Paragraph',
      accelerator: 'cmd+alt+0'
    })

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
        commandGroups: ['formatting']
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