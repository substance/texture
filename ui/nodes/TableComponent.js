'use strict';

var Component = require('substance/ui/Component');

function TableComponent() {
  Component.apply(this, arguments);
}

TableComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('table')
      .addClass('sc-table')
      .attr('data-id', this.props.node.id)
      .html(this.props.node.htmlContent);

    return el;
  };
};

Component.extend(TableComponent);

module.exports = TableComponent;