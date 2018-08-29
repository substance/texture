import {
  AnnotationComponent
} from 'substance'
import {
  CompositeComponent
} from '../../kit'

// new model based components
import AbstractComponent from './AbstractComponent'
import AuthorsListComponent from './AuthorsListComponent'
import FigureComponent from './FigureComponent'
import FrontMatterComponent from './FrontMatterComponent'
import HeadingComponent from './HeadingComponent'
import ManuscriptComponent from './ManuscriptComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import NodeModelComponent from './NodeModelComponent'

// TODO: these needs to be revisited
import AffiliationsListComponent from './AffiliationsListComponent'
import BreakComponent from './BreakComponent'
import EditorsListComponent from './EditorsListComponent'
import ElementNodeComponent from './ElementNodeComponent'
import ExtLinkComponent from './ExtLinkComponent'
import CaptionComponent from './CaptionComponent'
import ContainerNodeComponent from './ContainerNodeComponent'
import DispQuoteComponent from './DispQuoteComponent'
import FootnoteComponent from './FootnoteComponent'
import FnGroupComponent from './FnGroupComponent'
import GraphicComponent from './GraphicComponent'
import InlineFormulaComponent from './InlineFormulaComponent'
import ListComponent from './ListComponent'
import ListItemComponent from './ListItemComponent'
import ReferenceComponent from './ReferenceComponent'
import SeparatorComponent from './SeparatorComponent'
import SigBlockComponent from './SigBlockComponent'
import TableComponent from './TableComponent'
import XrefComponent from './XrefComponent'

import FnPreview from './FnPreview'
import FigPreview from './FigPreview'
import ModelPreviewComponent from './ModelPreviewComponent'

export default {
  name: 'manuscript-content',
  configure (config) {
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('back-matter', CompositeComponent)
    config.addComponent('bibr', ReferenceComponent)
    config.addComponent('figure', FigureComponent)
    config.addComponent('front-matter', FrontMatterComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('table-figure', FigureComponent)
    // TODO: remove this if sure that we don't need to support table-wrap anymore
    // config.addComponent('table-wrap', FigureComponent)
    // config.addComponent('table-wrap-preview', TableFigPreview)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    config.addComponent('entity', NodeModelComponent)
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('fn', FootnoteComponent)
    config.addComponent('fn-group', FnGroupComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('list', ListComponent)
    config.addComponent('list-item', ListItemComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('xref', XrefComponent)

    config.addComponent('model-preview', ModelPreviewComponent)
    config.addComponent('fn-preview', FnPreview)
    config.addComponent('fig-preview', FigPreview)

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

    config.addLabel('references', 'References')
    config.addLabel('footnotes', 'Footnotes')
  }
}
