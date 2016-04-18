'use strict';

var Component = require('substance/ui/Component');

/*
  Loads and displays a Scientist article

  Renders ScientistReader on mobile and ScientistWriter on the desktop
*/
function ScientistWriter() {
  Component.apply(this, arguments);
}

ScientistWriter.Prototype = function() {

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-scientist-writer');
    el.append('SCIENTIST_WRITER');
    return el;
  };
};

Component.extend(ScientistWriter);
module.exports = ScientistWriter;