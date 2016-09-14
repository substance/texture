import { Component, ToolGroup } from 'substance'

class TextureToolbar extends Component {
  render($$) {
    var el = $$("div").addClass(this.getClassNames())
    var commandStates = this.props.commandStates
    var componentRegistry = this.context.componentRegistry
    var toolTargets = this.context.tools
    var toolEls = []

    toolTargets.forEach(function(tools, target) {
      if (target === 'overlay') return;

      var TargetWrapperClass = componentRegistry.get('tool-target-'+target)
      if (TargetWrapperClass) {
        // If target wrapper component found (e.g. ToolDropDown) tools
        // get wrapped in it
        var wrapperEl = $$(TargetWrapperClass, {
          name: 'tool-target-'+target
        })
        tools.forEach(function(tool, name) {
          var toolProps = commandStates[name]
          // HACK: Also always include tool name which is equal to command name
          toolProps.name = name
          wrapperEl.append(
            $$(tool.Class, toolProps)
          )
        })
        toolEls.push(wrapperEl)
      } else {
        // Default: Render tool target flat
        tools.forEach(function(tool, name) {
          var toolProps = commandStates[name]
          // HACK: Also always include tool name which is equal to command name
          toolProps.name = name
          toolEls.push(
            $$(tool.Class, toolProps)
          )
        })
      }
    })
    el.append(
      $$(ToolGroup).append(toolEls)
    )
    return el
  }

  getClassNames() {
    return 'sc-toolbar';
  }
}

export default TextureToolbar;
