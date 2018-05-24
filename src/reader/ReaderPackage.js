import {
  BasePackage as SubstanceBasePackage,
  ListPackage,
  TextPropertyEditor,
  TextPropertyComponent,
  EditAnnotationCommand,
  SchemaDrivenCommandManager,
  substanceGlobals
} from 'substance'

import TextureArticlePackage from '../article/TextureArticlePackage'
import TextNodeComponent from '../editor/components/TextNodeComponent'
import PlainTextComponent from '../editor/components/PlainTextComponent'
import UnsupportedNodeComponent from '../editor/components/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from '../editor/components/UnsupportedInlineNodeComponent'
import AbstractComponent from '../editor/components/AbstractComponent'
import AffiliationsListComponent from '../editor/components/AffiliationsListComponent'
import AuthorsListComponent from '../editor/components/AuthorsListComponent'
import EditorsListComponent from '../editor/components/EditorsListComponent'
import BackComponent from '../editor/components/BackComponent'
import BodyComponent from '../editor/components/BodyComponent'
import BreakComponent from '../editor/components/BreakComponent'
import ContainerNodeComponent from '../editor/components/ContainerNodeComponent'
import ElementNodeComponent from '../editor/components/ElementNodeComponent'
import FigComponent from '../editor/components/FigComponent'
import CaptionComponent from '../editor/components/CaptionComponent'
import FrontComponent from '../editor/components/FrontComponent'
import GraphicComponent from '../editor/components/GraphicComponent'
import DispQuoteComponent from '../editor/components/DispQuoteComponent'
import InlineFormulaComponent from '../editor/components/InlineFormulaComponent'
import TableComponent from '../editor/components/TableComponent'
import HeadingComponent from '../editor/components/HeadingComponent'
import ManuscriptComponent from '../editor/components/ManuscriptComponent'
import TOC from '../editor/components/TOC'
import TranslationsComponent from '../editor/components/TranslationsComponent'
import FnGroupComponent from '../editor/components/FnGroupComponent'
import FnComponent from '../editor/components/FnComponent'
import RefListComponent from '../editor/components/RefListComponent'
import RefComponent from '../editor/components/RefComponent'
import SeparatorComponent from '../editor/components/SeparatorComponent'
import SigBlockComponent from '../editor/components/SigBlockComponent'
import TitleGroupComponent from '../editor/components/TitleGroupComponent'
import XrefComponent from '../editor/components/XrefComponent'

substanceGlobals.DEBUG_RENDERING = true

export default {
  name: 'reader',
  configure(config) {
    config.import(SubstanceBasePackage)
    config.import(TextureArticlePackage)

    // EXPERIMENTAL:
    // a CommandManager that uses the xmlSchema to inhibit commands
    // which would generate disallowed content
    config.setCommandManagerClass(SchemaDrivenCommandManager)

    // Experimental
    config.setLabelGenerator('references', {
      template: '[$]',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('figures', {
      name: 'Figure',
      plural: 'Figures',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('tables', {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('footnotes', {
      template: '$',
      and: ',',
      to: '-',
    })

    // Base functionality
    config.addComponent('text-node', TextNodeComponent)
    config.addComponent('text-property-editor', TextPropertyEditor)
    config.addComponent('plain-text-property', PlainTextComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    // Node components
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('translations', TranslationsComponent)
    config.addComponent('back', BackComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('front', FrontComponent)
    config.addComponent('fig', FigComponent)
    config.addComponent('fn', FnComponent)
    config.addComponent('fn-group', FnGroupComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('list', ListPackage.ListComponent)
    config.addComponent('list-item', TextPropertyComponent)
    config.addComponent('ref', RefComponent)
    config.addComponent('ref-list', RefListComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table-wrap', FigComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('title-group', TitleGroupComponent)
    config.addComponent('toc', TOC)
    config.addComponent('tr', ElementNodeComponent)
    config.addComponent('xref', XrefComponent)

    // Panels and other displays
    config.addComponent('manuscript', ManuscriptComponent)
    config.addCommand('edit-ext-link', EditAnnotationCommand, {
      nodeType: 'ext-link',
      commandGroup: 'prompt'
    })

  }
}
