import {
  ButtonPackage, ContextMenuPackage, ModalPackage, OverlayPackage, DropzonesPackage,
  ScrollbarPackage, ScrollPanePackage, BodyScrollPanePackage, SplitPanePackage,
  TabbedPanePackage, FilePackage, ToolPanelPackage, IsolatedNodeComponent,
  InlineNodeComponent, AnnotationComponent
} from 'substance'

import ScrollPane from './ScrollPane'
import BodyScrollPane from './BodyScrollPane'
import Menu from './Menu'
import MenuGroup from './MenuGroup'
import MenuItem from './MenuItem'
import Button from './Button'
import ContextMenu from './ContextMenu'
import Overlay from './Overlay'
import ToggleTool from './ToggleTool'
import Toolbar from './Toolbar'
import ToolDropdown from './ToolDropdown'
import ToolGroup from './ToolGroup'
import ToolPrompt from './ToolPrompt'

export default {
  name: 'TextureBase',
  configure: function (configurator) {
    configurator.import(ButtonPackage)
    configurator.import(FilePackage)
    configurator.import(ScrollPanePackage)
    configurator.import(BodyScrollPanePackage)
    configurator.import(SplitPanePackage)
    configurator.import(TabbedPanePackage)
    configurator.import(ScrollbarPackage)
    configurator.import(ModalPackage)
    configurator.import(ContextMenuPackage)
    configurator.import(OverlayPackage)
    configurator.import(DropzonesPackage)
    configurator.import(ToolPanelPackage)

    configurator.addComponent('isolated-node', IsolatedNodeComponent)
    configurator.addComponent('inline-node', InlineNodeComponent)
    configurator.addComponent('annotation', AnnotationComponent)

    // replacing Substance components with custom ones
    configurator.addComponent('scroll-pane', ScrollPane, true)
    configurator.addComponent('body-scroll-pane', BodyScrollPane, true)

    configurator.addComponent('menu', Menu, true)
    configurator.addComponent('menu-group', MenuGroup, true)
    configurator.addComponent('menu-item', MenuItem, true)
    configurator.addComponent('button', Button, true)
    configurator.addComponent('context-menu', ContextMenu, true)
    configurator.addComponent('overlay', Overlay, true)
    configurator.addComponent('toggle-tool', ToggleTool, true)
    configurator.addComponent('toolbar', Toolbar, true)
    configurator.addComponent('tool-dropdown', ToolDropdown, true)
    configurator.addComponent('tool-group', ToolGroup, true)
    configurator.addComponent('tool-prompt', ToolPrompt, true)

    configurator.addLabel('text-types', {
      en: 'Text Type',
      de: 'Texttyp'
    })
    configurator.addLabel('container-selection', {
      en: 'Container',
      de: 'Container'
    })
    configurator.addLabel('@container', {
      en: 'Container',
      de: 'Container'
    })
  }
}
