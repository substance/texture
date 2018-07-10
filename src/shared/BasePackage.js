import {
  ButtonPackage, ContextMenuPackage, ModalPackage, OverlayPackage, DropzonesPackage,
  ScrollbarPackage, ScrollPanePackage, BodyScrollPanePackage, SplitPanePackage,
  TabbedPanePackage, FilePackage, ToolPanelPackage, IsolatedNodeComponent,
  InlineNodeComponent, AnnotationComponent
} from 'substance'

export default {
  name: 'TextureBase',
  configure: function (config) {
    config.import(ButtonPackage)
    config.import(FilePackage)
    config.import(ScrollPanePackage)
    config.import(BodyScrollPanePackage)
    config.import(SplitPanePackage)
    config.import(TabbedPanePackage)
    config.import(ScrollbarPackage)
    config.import(ModalPackage)
    config.import(ContextMenuPackage)
    config.import(OverlayPackage)
    config.import(DropzonesPackage)
    config.import(ToolPanelPackage)

    config.addLabel('text-types', {
      en: 'Text Type',
      de: 'Texttyp'
    })
    config.addLabel('container-selection', {
      en: 'Container',
      de: 'Container'
    })
    config.addLabel('@container', {
      en: 'Container',
      de: 'Container'
    })
    config.addComponent('isolated-node', IsolatedNodeComponent)
    config.addComponent('inline-node', InlineNodeComponent)
    config.addComponent('annotation', AnnotationComponent)
  }
}
