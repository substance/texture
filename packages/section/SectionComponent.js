'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function SectionComponent() {
  SectionComponent.super.apply(this, arguments);
}

SectionComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-section');

    // TODO: would be good to know the tag name or the path
    // el.append(
    //   $$('div').addClass('se-tag').append('section')
    // );

    if (node.title) {
      el.append(
        $$(TextPropertyEditor, { path: [node.id, 'title'] }).ref('titleEditor')
          .addClass('se-title')
      );
    }

    el.append(
      $$(ContainerEditor, { node: node }).ref('contentEditor')
        .addClass('se-content')
    );

    return el;
  };

};

Component.extend(SectionComponent);

SectionComponent.static.fullWidth = true;
SectionComponent.static.noStyle = true;

module.exports = SectionComponent;
