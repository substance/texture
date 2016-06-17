'use strict';

var Component = require('substance/ui/Component');
var ToolGroup = require('substance/ui/ToolGroup');

function ScientistWriterTools() {
  Component.apply(this, arguments);
}

ScientistWriterTools.Prototype = function() {

  this.render = function($$) {
    var el = $$("div").addClass('sc-scientist-writer-toolbar');
    var commandStates = this.props.commandStates;
    var toolRegistry = this.context.toolRegistry;

    var tools = [];
    toolRegistry.forEach(function(tool, name) {
      if (!tool.options.overlay) {
        tools.push(
          $$(tool.Class, commandStates[name])
        );
      }
    });

    el.append(
      $$(ToolGroup).append(tools)
    );
    return el;
  };
};

Component.extend(ScientistWriterTools);
module.exports = ScientistWriterTools;
