import {
  BasePackage as SubstanceBasePackage,
  ListPackage,
  TextPropertyEditor,
  TextPropertyComponent,
  SchemaDrivenCommandManager,
  AnnotationComponent
} from 'substance'
import {
  TextureIsolatedNodeComponent, TextureIsolatedInlineNodeComponent
} from '../../shared'

import TextNodeComponent from '../editor/TextNodeComponent'
import PlainTextComponent from '../editor/PlainTextComponent'
import UnsupportedNodeComponent from '../editor/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from '../editor/UnsupportedInlineNodeComponent'
import BreakComponent from '../editor/BreakComponent'
import ContainerNodeComponent from '../editor/ContainerNodeComponent'
import ElementNodeComponent from '../editor/ElementNodeComponent'
import CaptionComponent from '../editor/CaptionComponent'
import FrontComponent from '../editor/FrontComponent'
import GraphicComponent from '../editor/GraphicComponent'
import DispQuoteComponent from '../editor/DispQuoteComponent'
import InlineFormulaComponent from '../editor/InlineFormulaComponent'
import TableComponent from '../editor/TableComponent'
import HeadingComponent from '../editor/HeadingComponent'
import TOC from '../editor/TOC'
import FnGroupComponent from '../editor/FnGroupComponent'
import FnComponent from '../editor/FnComponent'
import SeparatorComponent from '../editor/SeparatorComponent'
import SigBlockComponent from '../editor/SigBlockComponent'

import ArticleAbstractComponent from './ArticleAbstractComponent'
import ArticleBodyComponent from './ArticleBodyComponent'
import ArticleHeaderComponent from './ArticleHeaderComponent'
import ArticleReferencesComponent from './ArticleReferencesComponent'
import ArticleTitleComponent from './ArticleTitleComponent'
import ArticleContribsComponent from './ArticleContribsComponent'
import BibliographyComponent from './BibliographyComponent'
import FigureComponent from './FigureComponent'
import ExtLinkComponent from './ExtLinkComponent'
import ReaderXrefComponent from './ReaderXrefComponent'

export default {
  name: 'Reader',
  configure (config) {
    // TODO: reduce redundancy with ManuscriptEditorPackage
    // probably we want to use this package as a base for the editor package
    // and add configurations related to editing
    config.import(SubstanceBasePackage)

    // a CommandManager that uses the xmlSchema to inhibit commands
    // which would generate disallowed content
    config.setCommandManagerClass(SchemaDrivenCommandManager)

    // Experimental
    config.setLabelGenerator('references', {
      template: '[$]',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('figures', {
      name: 'Figure',
      plural: 'Figures',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('tables', {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('footnotes', {
      template: '$',
      and: ',',
      to: '-'
    })

    // Base functionality
    config.addComponent('isolated-node', TextureIsolatedNodeComponent, 'force')
    config.addComponent('inline-node', TextureIsolatedInlineNodeComponent, 'force')
    config.addComponent('text-node', TextNodeComponent, 'force')
    config.addComponent('text-property-editor', TextPropertyEditor, 'force')
    config.addComponent('plain-text-property', PlainTextComponent, 'force')
    config.addComponent('container', ContainerNodeComponent, 'force')

    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('front', FrontComponent)
    config.addComponent('fig', FigureComponent)
    config.addComponent('fn', FnComponent)
    config.addComponent('fn-group', FnGroupComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('list', ListPackage.ListComponent)
    config.addComponent('list-item', TextPropertyComponent)
    config.addComponent('ref', BibliographyComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table-wrap', FigureComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('toc', TOC)
    config.addComponent('tr', ElementNodeComponent)
    config.addComponent('xref', ReaderXrefComponent)
    config.addComponent('figure', FigureComponent)

    // ATTENTION: I have changed the behavior so that
    // unregistered annotations or inline-nodes are
    // rendered using the UnsupportedInlineNodeComponent
    // instead of rendering all by default with AnnotationComponent
    config.addComponent('bold', AnnotationComponent)
    config.addComponent('italic', AnnotationComponent)
    config.addComponent('sub', AnnotationComponent)
    config.addComponent('sup', AnnotationComponent)
    config.addComponent('monospace', AnnotationComponent)
    config.addComponent('ext-link', ExtLinkComponent)

    // New Shared Components
    config.addComponent('article-abstract', ArticleAbstractComponent)
    config.addComponent('article-body', ArticleBodyComponent)
    config.addComponent('article-contribs', ArticleContribsComponent)
    config.addComponent('article-header', ArticleHeaderComponent)
    config.addComponent('article-references', ArticleReferencesComponent)
    config.addComponent('article-title', ArticleTitleComponent)
  }
}
