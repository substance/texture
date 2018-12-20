import {
  AnnotationComponent
} from 'substance'
import {
  CompositeComponent
} from '../../kit'

// new model based components
import AuthorsListComponent from './AuthorsListComponent'
import FigureComponent from './FigureComponent'
import FigurePanelComponent from './FigurePanelComponent'
import HeadingComponent from './HeadingComponent'
import ManuscriptComponent from './ManuscriptComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import NodeModelComponent from './NodeModelComponent'

// TODO: these needs to be revisited
import AffiliationsListComponent from './AffiliationsListComponent'
import BioComponent from './BioComponent'
import BreakComponent from './BreakComponent'
import EditorsListComponent from './EditorsListComponent'
import ElementNodeComponent from './ElementNodeComponent'
import ExtLinkComponent from './ExtLinkComponent'
import CaptionComponent from './CaptionComponent'
import ContainerNodeComponent from './ContainerNodeComponent'
import DispQuoteComponent from './DispQuoteComponent'
import DispFormulaComponent from './DispFormulaComponent'
import FootnoteComponent from './FootnoteComponent'
import GraphicComponent from './GraphicComponent'
import InlineFormulaComponent from './InlineFormulaComponent'
import ListComponent from './ListComponent'
import ListItemComponent from './ListItemComponent'
import ReferenceComponent from './ReferenceComponent'
import SigBlockComponent from './SigBlockComponent'
import TableComponent from './TableComponent'
import TableFigureComponent from './TableFigureComponent'
import XrefComponent from './XrefComponent'

import ModelPreviewComponent from './ModelPreviewComponent'

import SectionLabel from './SectionLabel'

export default {
  name: 'manuscript-content',
  configure (config) {
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('back-matter', CompositeComponent)
    config.addComponent('bibr', ReferenceComponent)
    config.addComponent('figure', FigureComponent)
    config.addComponent('figure-panel', FigurePanelComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('table-figure', TableFigureComponent)
    // TODO: find out why we need both, 'unsupported' and 'unsupported-node'
    // latter is defined in schema, while first is only used in the context of models (FlowContentComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-node', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    config.addComponent('entity', NodeModelComponent)
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('bio', BioComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-formula', DispFormulaComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('fn', FootnoteComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('inline-graphic', GraphicComponent)
    config.addComponent('list', ListComponent)
    config.addComponent('list-item', ListItemComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('xref', XrefComponent)

    config.addComponent('model-preview', ModelPreviewComponent)

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

    // Manuscript sections config
    config.addComponent('section-label', SectionLabel)
    config.addLabel('title-label', 'Title')
    config.addLabel('title-placeholder', 'Enter a title for your article')
    config.addLabel('abstract-label', 'Abstract')
    config.addLabel('abstract-placeholder', 'Please provide a short description of your article.')
    config.addLabel('body-label', 'Main text')
    config.addLabel('body-placeholder', 'Write your article here.')
    config.addLabel('authors-label', 'Authors')
    config.addLabel('references-label', 'References')
    config.addLabel('footnotes-label', 'Footnotes')

    // Figure sections config
    config.addLabel('label-label', 'Label')
    config.addLabel('caption-label', 'Caption')

    // Used for rendering warning in case of missing images
    config.addIcon('graphic-load-error', { 'fontawesome': 'fa-warning' })
    config.addLabel('graphic-load-error', 'We couldn\'t load an image, sorry.')
  }
}
