'use strict';

var Component = require('substance/ui/Component');

/*
  Edit XML nodes (= unsupported nodes)
*/
function EditXML() {
  Component.apply(this, arguments);
}

EditXML.Prototype = function() {
  this.render = function($$) {
    var el = $$('div')
      .addClass('sc-edit-xml')
      .attr('data-id', this.props.node.id).append(
        $$('textarea').append(this.props.node.xml)
      );
    return el;
  };
};

Component.extend(EditXML);
module.exports = EditXML;