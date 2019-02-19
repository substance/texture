import {
  ButtonPackage, ContextMenuPackage, OverlayPackage, DropzonesPackage,
  ScrollbarPackage, ScrollPanePackage, BodyScrollPanePackage, SplitPanePackage,
  TabbedPanePackage, ToolPanelPackage
} from 'substance'

import AnnotationComponent from './ui/AnnotationComponent'
import BodyScrollPane from './ui/BodyScrollPane'
import Button from './ui/Button'
import ContainerEditor from './ui/_ContainerEditor'
import ContextMenu from './ui/ContextMenu'
import Input from './ui/Input'
import IsolatedNodeComponent from './ui/_IsolatedNodeComponent'
import IsolatedInlineNodeComponent from './ui/_IsolatedInlineNodeComponent'
import ModalDialog from './ui/ModalDialog'
import Overlay from './ui/Overlay'
import ScrollPane from './ui/ScrollPane'
import TextPropertyComponent from './ui/_TextPropertyComponent'
import TextPropertyEditor from './ui/_TextPropertyEditor'
import ToggleTool from './ui/ToggleTool'
import Toolbar from './ui/Toolbar'
import ToolDropdown from './ui/ToolDropdown'
import ToolGroup from './ui/ToolGroup'
import ToolPrompt from './ui/ToolPrompt'
import ToolSeparator from './ui/ToolSeparator'
import ToolSwitcher from './ui/ToolSwitcher'
import TextArea from './ui/TextArea'

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
    configurator.addComponent('container-editor', ContainerEditor)
    configurator.addComponent('isolated-node', IsolatedNodeComponent)
    configurator.addComponent('inline-node', IsolatedInlineNodeComponent)
    configurator.addComponent('text-property', TextPropertyComponent)
    configurator.addComponent('text-property-editor', TextPropertyEditor)

    // replacing Substance components with custom ones
    configurator.addComponent('scroll-pane', ScrollPane, true)
    configurator.addComponent('body-scroll-pane', BodyScrollPane, true)

    configurator.addComponent('button', Button, true)
    configurator.addComponent('context-menu', ContextMenu, true)
    configurator.addComponent('input', Input)
    configurator.addComponent('modal', ModalDialog)
    configurator.addComponent('overlay', Overlay, true)
    configurator.addComponent('text-area', TextArea)
    configurator.addComponent('toggle-tool', ToggleTool, true)
    configurator.addComponent('toolbar', Toolbar, true)
    configurator.addComponent('tool-dropdown', ToolDropdown, true)
    configurator.addComponent('tool-group', ToolGroup, true)
    configurator.addComponent('tool-prompt', ToolPrompt, true)
    configurator.addComponent('tool-separator', ToolSeparator, true)
    configurator.addComponent('tool-switcher', ToolSwitcher, true)

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
