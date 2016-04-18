'use strict';

var Component = require('substance/ui/Component');

function ScientistReader() {
  Component.apply(this, arguments);
}

ScientistReader.Prototype = function() {

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-scientist-reader');
    el.append('SCIENTIST_READER');
    return el;
  };
};

Component.extend(ScientistWriter);
module.exports = ScientistWriter;