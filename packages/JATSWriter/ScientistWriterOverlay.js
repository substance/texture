'use strict';

var Component = require('substance/ui/Component');

function ScientistWriterOverlay() {
  Component.apply(this, arguments);
}

ScientistWriterOverlay.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-prose-editor-overlay');
    var commandStates = this.props.commandStates;
    var toolRegistry = this.context.toolRegistry;

    toolRegistry.forEach(function(tool) {
      if (tool.options.overlay) {
        var toolProps = tool.Class.static.getProps(commandStates);
        if (toolProps) {
          el.append(
            $$(tool.Class, toolProps)
          );
        }
      }
    });
    return el;
  };
};

Component.extend(ScientistWriterOverlay);

module.exports = ScientistWriterOverlay;
