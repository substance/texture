import {
  AnnotationComponent, IsolatedInlineNodeComponent, TextPropertyComponent
} from 'substance'

import BodyScrollPane from './ui/BodyScrollPane'
import Button from './ui/Button'
import ContainerEditor from './ui/_ContainerEditor'
import ContextMenu from './ui/ContextMenu'
import Input from './ui/Input'
import IsolatedNodeComponent from './ui/_IsolatedNodeComponent'
import ModalDialog from './ui/ModalDialog'
import OverlayCanvas from './ui/OverlayCanvas'
import ScrollPane from './ui/ScrollPane'
import TextPropertyEditor from './ui/_TextPropertyEditor'
import TextInput from './ui/TextInput'
import Tool from './ui/Tool'
import ToggleTool from './ui/ToggleTool'
import Toolbar from './ui/Toolbar'
import ToolDropdown from './ui/ToolDropdown'
import ToolGroup from './ui/ToolGroup'
import ToolSeparator from './ui/ToolSeparator'
import ToolSpacer from './ui/ToolSpacer'

export default {
  name: 'TextureBase',
  configure: function (configurator) {
    configurator.addComponent('annotation', AnnotationComponent)
    // customized built-ins
    configurator.addComponent('container-editor', ContainerEditor)
    configurator.addComponent('isolated-node', IsolatedNodeComponent)
    configurator.addComponent('inline-node', IsolatedInlineNodeComponent)
    configurator.addComponent('text-property', TextPropertyComponent)
    configurator.addComponent('text-property-editor', TextPropertyEditor)
    configurator.addComponent('text-input', TextInput)

    // replacing Substance components with custom ones
    configurator.addComponent('scroll-pane', ScrollPane)
    configurator.addComponent('body-scroll-pane', BodyScrollPane)

    configurator.addComponent('button', Button)
    configurator.addComponent('context-menu', ContextMenu)
    configurator.addComponent('input', Input)
    configurator.addComponent('modal', ModalDialog)
    configurator.addComponent('overlay-canvas', OverlayCanvas)
    configurator.addComponent('tool', Tool)
    // TODO: remove toggle-tool
    configurator.addComponent('toggle-tool', ToggleTool)
    configurator.addComponent('toolbar', Toolbar)
    configurator.addComponent('tool-dropdown', ToolDropdown)
    configurator.addComponent('tool-group', ToolGroup)
    configurator.addComponent('tool-separator', ToolSeparator)
    configurator.addComponent('tool-spacer', ToolSpacer)

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

    configurator.addIcon('dropdown', { 'fontawesome': 'fa-angle-down' })
  }
}
