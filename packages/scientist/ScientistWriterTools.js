'use strict';

var Component = require('substance/ui/Component');
var Toolbar = require('substance/ui/Toolbar');
var clone = require('lodash/clone');

function ScientistWriterTools() {
  Component.apply(this, arguments);
}

ScientistWriterTools.Prototype = function() {

  this.render = function($$) {
    var el = $$("div").addClass('sc-example-toolbar');
    var commandStates = this.props.commandStates;
    var toolRegistry = this.context.toolRegistry;
    var tools = [];
    
    toolRegistry.forEach(function(tool, name) {
      if (!tool.options.overlay) {
        // TODO: Remove clone hack once #577 is fixed
        tools.push(
          $$(tool.Class, clone(commandStates[name]))
        );
      }
    });

    el.append(
      $$(Toolbar.Group).append(
        tools
      )
    );
    return el;
  };
};

Component.extend(ScientistWriterTools);
module.exports = ScientistWriterTools;
