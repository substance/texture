import {
  ButtonPackage, ContextMenuPackage, OverlayPackage, DropzonesPackage,
  ScrollbarPackage, ScrollPanePackage, BodyScrollPanePackage, SplitPanePackage,
  TabbedPanePackage, ToolPanelPackage
} from 'substance'

import {
  IsolatedNodeComponentNew, IsolatedInlineNodeComponentNew, ContainerEditorNew,
  TextPropertyComponentNew, TextPropertyEditorNew
} from './model/SubstanceModifications'

import AnnotationComponent from './ui/AnnotationComponent'
import ScrollPane from './ui/ScrollPane'
import BodyScrollPane from './ui/BodyScrollPane'
import Menu from './ui/Menu'
import MenuGroup from './ui/MenuGroup'
import MenuItem from './ui/MenuItem'
import ModalDialog from './ui/ModalDialog'
import Button from './ui/Button'
import ContextMenu from './ui/ContextMenu'
import Overlay from './ui/Overlay'
import ToggleTool from './ui/ToggleTool'
import Toolbar from './ui/Toolbar'
import ToolDropdown from './ui/ToolDropdown'
import ToolGroup from './ui/ToolGroup'
import ToolPrompt from './ui/ToolPrompt'

export default {
  name: 'TextureBase',
  configure: function (configurator) {
    configurator.import(ButtonPackage)
    configurator.import(ScrollPanePackage)
    configurator.import(BodyScrollPanePackage)
    configurator.import(SplitPanePackage)
    configurator.import(TabbedPanePackage)
    configurator.import(ScrollbarPackage)
    configurator.import(ContextMenuPackage)
    configurator.import(OverlayPackage)
    configurator.import(DropzonesPackage)
    configurator.import(ToolPanelPackage)

    configurator.addComponent('annotation', AnnotationComponent)
    // customized built-ins
    configurator.addComponent('container-editor', ContainerEditorNew)
    configurator.addComponent('isolated-node', IsolatedNodeComponentNew)
    configurator.addComponent('inline-node', IsolatedInlineNodeComponentNew)
    configurator.addComponent('text-property', TextPropertyComponentNew)
    configurator.addComponent('text-property-editor', TextPropertyEditorNew)

    // replacing Substance components with custom ones
    configurator.addComponent('scroll-pane', ScrollPane, true)
    configurator.addComponent('body-scroll-pane', BodyScrollPane, true)

    configurator.addComponent('menu', Menu, true)
    configurator.addComponent('menu-group', MenuGroup, true)
    configurator.addComponent('menu-item', MenuItem, true)
    configurator.addComponent('modal', ModalDialog)
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
