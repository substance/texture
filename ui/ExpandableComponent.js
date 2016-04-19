'use strict';

var Component = require('substance/ui/Component');

function ExpandableComponent() {
  Component.apply(this, arguments);
}

ExpandableComponent.Prototype = function() {
  this._expand = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      expanded: true
    });
  };

  this._collapse = function() {
    this.setState({
      expanded: false
    });
  };

  this.render = function($$) {
    var el = $$('span')
      .addClass('sc-expandable-component')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false);

    if (this.state.expanded) {
      el.addClass('sm-expanded');
      el.append(
        $$('button').append('Hide').on('click', this._collapse),
        $$('div').append(this.props.node.xml)
      );
    } else {
      el.addClass('sm-collapsed');
      el.append(
        $$('button').addClass('se-toggle').append(
          '<'+this.props.node.tagName+'>'
        ).on('click', this._expand)
      );
    }
    return el;
  };
};

Component.extend(ExpandableComponent);

module.exports = ExpandableComponent;