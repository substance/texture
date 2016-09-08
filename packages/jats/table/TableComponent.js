'use strict';

import { Component } from 'substance'

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

export default TableComponent;